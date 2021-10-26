'use strict';
const $test = require('./vendor/nodejs-unit-test-library');
const { assert, it } = $test;
console.group('\x1b[33m%s\x1b[0m', 'Workout Desc parse tests');

let data = require('./testdata');
let { parseRepsInfo, parseLoadInfo, parseMovementString, parseWorkout } = require('./helpers/parse-workout-desc');

$test.it('should parse the load info - ex: ♀ 20-in. box', () => {
  let input = [
    `♀ 20-in. box, 14-lb. ball, 45 lb barbell, 115 lb barbell`, //0
    `♀ 95 lbs. ♂ 135 lb.`, //1
    `♀ 105 lb. ♂ 155 lb.`, //2
    `♀ 20-in. box, 14-lb. ball`, //3
    `♂ 24-in. box, 20-lb. ball`, //4
    `♀ 25-lb. dumbbells ♂ 35-lb. dumbbells`, //5
    `♀ 40 lb. DBs ♂ 60 lb. DBs`, //6
    `♀ 20-lb. ball, 9-ft. target`, //7
    `♂ 30-lb. ball, 10-ft. target`, //8
    `♀ 14-lb. ball to 9 ft.`, //9
    `♂ 20-lb. ball to 10 ft.`, //10
    `♀ 75 lb. (Virtual Games use 65 lb.)`, //11
    `♂ 105 lb. (Virtual Games use 95 lb.)`, //12
    `Men: 155 lb.`, //13
    `Women: 105 lb.`, //14
    `M: 50-lb. dumbbell`, //15
    `M 50-lb. dumbbell`, //16
    `M50-lb. dumbbell`, //no 17
    `F: 50-lb. dumbbell`, //18
    `F 50-lb. dumbbell`, //19
    `F50-lb. dumbbell`, //no //20
    `asdfasdf`, //21
    `50-lb`, //22
    `Female 35 lb dumbbell Male 50 lb dumbbells`, //23
  ];
  let output = [
    [
      { gender: 'f', load: 20, unit: 'in', equipment: 'box' }, //0
      { gender: 'f', load: 14, unit: 'lb', equipment: 'ball' },
      { gender: 'f', load: 45, unit: 'lb', equipment: 'barbell' },
      { gender: 'f', load: 115, unit: 'lb', equipment: 'barbell' },
    ],
    [
      { gender: 'f', load: 95, unit: 'lbs', equipment: null }, //1
      { gender: 'm', load: 135, unit: 'lb', equipment: null },
    ],
    [
      { gender: 'f', load: 105, unit: 'lb', equipment: null }, //2
      { gender: 'm', load: 155, unit: 'lb', equipment: null },
    ],
    [
      { gender: 'f', load: 20, unit: 'in', equipment: 'box' }, //3
      { gender: 'f', load: 14, unit: 'lb', equipment: 'ball' },
    ],
    [
      { gender: 'm', load: 24, unit: 'in', equipment: 'box' }, //4
      { gender: 'm', load: 20, unit: 'lb', equipment: 'ball' },
    ],
    [
      { gender: 'f', load: 25, unit: 'lb', equipment: 'dumbbells' }, //5
      { gender: 'm', load: 35, unit: 'lb', equipment: 'dumbbells' },
    ],

    [
      { gender: 'f', load: 40, unit: 'lb', equipment: 'dbs' }, //6
      { gender: 'm', load: 60, unit: 'lb', equipment: 'dbs' },
    ],
    [
      { gender: 'f', load: 20, unit: 'lb', equipment: 'ball' }, //7
      { gender: 'f', load: 9, unit: 'ft', equipment: 'target' },
    ],
    [
      { gender: 'm', load: 30, unit: 'lb', equipment: 'ball' }, //8
      { gender: 'm', load: 10, unit: 'ft', equipment: 'target' },
    ],
    [{ gender: 'f', load: 14, unit: 'lb', equipment: 'ball' }], //9
    [{ gender: 'm', load: 20, unit: 'lb', equipment: 'ball' }], //10
    [{ gender: 'f', load: 75, unit: 'lb', equipment: '(virtual' }], //11
    [{ gender: 'm', load: 105, unit: 'lb', equipment: '(virtual' }], //12
    [{ gender: 'm', load: 155, unit: 'lb', equipment: null }], //13
    [{ gender: 'f', load: 105, unit: 'lb', equipment: null }], //14
    [{ gender: 'm', load: 50, unit: 'lb', equipment: 'dumbbell' }], //15
    [{ gender: 'm', load: 50, unit: 'lb', equipment: 'dumbbell' }], //16
    [], //17
    [{ gender: 'f', load: 50, unit: 'lb', equipment: 'dumbbell' }], //18
    [{ gender: 'f', load: 50, unit: 'lb', equipment: 'dumbbell' }], //19
    [], //20
    [], //21
    [], //22
    [
      { gender: 'f', load: 35, unit: 'lb', equipment: 'dumbbell' }, //23
      { gender: 'm', load: 50, unit: 'lb', equipment: 'dumbbells' },
    ],
  ];

  for (let i = 0; i < input.length; i++) {
    let result = parseLoadInfo(input[i]);
    assert.strictEqual(result.length, output[i].length, `Load Info Array length not as expected for ${i}`);
    for (let j = 0; j < result.length; j++) {
      let actual = result[j];
      let expected = output[i][j];
      assert.strictEqual(actual.gender, expected.gender, `Gender does not match for input ${i}, element ${j}`);
      assert.strictEqual(actual.load, expected.load, `Load does not match for input ${i}, element ${j}`);
      assert.strictEqual(actual.unit, expected.unit, `unit does not match for input ${i}, element ${j}`);
      assert.strictEqual(actual.equipment, expected.equipment, `equipment does not match for input ${i}, element ${j}`);
    }
  }
});

$test.it('should parse reps & movements in the incoming string', () => {
  let input = [
    '100 pull-ups',
    '25 push-ups',
    '30-second handstand hold',
    '20 seconds of pull-ups',
    '30 yard sprint',
    'Run 400 meters',
    '500-m row',
    '30-second ring L-sit',
    '200-m dumbbell farmers carry',
    'Row for 50 seconds, rest 10 seconds',
    '1,000-m row',
    'max pull-ups',
    '5,000 cal rows',
    '21-15-9',
    'm 30lb',
    'female 20lb',
    'm: 24lb',
    '¾ bodyweight hang power snatches',
    '4 Rounds',
    '200 ',
    '500-m row',
    '12 bodyweight deadlifts',
    '21 box jumps',
    '20-in. box',
    '9 Deadlifts',
    '6 Burpees',
    '3 Power Cleans',
    '♀ 95 lb. ♂ 135 lb.',
    '3-minute handstand hold',
    '100 squats',
    '50-meter handstand walk',
    '100 squats',
    '30 handstand push-ups',
    '50 walking lunge steps',
    '25 chest-to-bar pull-ups',
    '50 box jumps',
    '25 triple-unders',
    '50 back extensions',
    '25 ring dips',
    '50 knees-to-elbows',
    '25 wall-ball "2-fer-1s"',
    '50 sit-ups',
    '5 rope climbs 15 ft.',
    '♀ 20-in. box, 14-lb. ball',
    '♂ 24-in. box, 20-lb. ball',
    '4 Dumbbell    Thrusters',
    '6 Toes-to-bars',
    '24 double-unders',
    '30 du',
    'Max jumping-jacks',
    '100 pull-ups',
    '100 push ups',
    '100 sit ups',
    '100 back   squats',
    '100 Squat',
    '100 air-Squat',
    'max box-jumps',
  ];
  let output = [
    { reps: 100, load: null, unit: null, movement: 'pull-ups' },
    { reps: 25, load: null, unit: null, movement: 'push-ups' },
    { reps: null, load: 30, unit: 'second', movement: 'handstand hold' },
    { reps: null, load: 20, unit: 'seconds', movement: 'pull-ups' },
    { reps: 30, load: null, unit: 'yard', movement: 'sprint' },
    { reps: null, load: 400, unit: 'meters', movement: 'Run' },
    { reps: 500, load: null, unit: 'm', movement: 'row' },
    { reps: null, load: 30, unit: 'second', movement: 'ring L-sit' },
    { reps: 200, load: null, unit: 'm', movement: 'dumbbell farmers carry' },
    { reps: null, load: 50, unit: 'seconds,', movement: 'Row' },
    { reps: 1000, load: null, unit: 'm', movement: 'row' },
    { reps: 'Max', load: null, unit: null, movement: 'pull-ups' },
    { reps: 5000, load: null, unit: 'cal', movement: 'rows' },
    null,
    null,
    null,
    null,
    null,
    { rounds: 4 },
    null,
    { reps: 500, load: null, unit: 'm', movement: 'row' },
    { reps: 12, load: null, unit: null, movement: 'bodyweight deadlifts' },
    { reps: 21, load: null, unit: null, movement: 'box jumps' },
    { reps: 20, load: null, unit: 'in.', movement: 'box' },
    { reps: 9, load: null, unit: null, movement: 'Deadlifts' },
    { reps: 6, load: null, unit: null, movement: 'Burpees' },
    { reps: 3, load: null, unit: null, movement: 'Power Cleans' },
    null,
    { reps: null, load: 3, unit: 'minute', movement: 'handstand hold' },
    { reps: 100, load: null, unit: null, movement: 'squats' },
    { reps: 50, load: null, unit: 'meter', movement: 'handstand walk' },
    { reps: 100, load: null, unit: null, movement: 'squats' },
    { reps: 30, load: null, unit: null, movement: 'handstand push-ups' },
    { reps: 50, load: null, unit: null, movement: 'walking lunge steps' },
    { reps: 25, load: null, unit: null, movement: 'chest-to-bar pull-ups' },
    { reps: 50, load: null, unit: null, movement: 'box jumps' },
    { reps: 25, load: null, unit: null, movement: 'triple-unders' },
    { reps: 50, load: null, unit: null, movement: 'back extensions' },
    { reps: 25, load: null, unit: null, movement: 'ring dips' },
    { reps: 50, load: null, unit: null, movement: 'knees-to-elbows' },
    { reps: 25, load: null, unit: null, movement: 'wall-ball "2-fer-1s"' },
    { reps: 50, load: null, unit: null, movement: 'sit-ups' },
    { reps: 5, load: null, unit: null, movement: 'rope climbs 15 ft.' },
    null,
    null,
    { reps: 4, load: null, unit: null, movement: 'Dumbbell    Thrusters' },
    { reps: 6, load: null, unit: null, movement: 'Toes-to-bars' },
    { reps: 24, load: null, unit: null, movement: 'double-unders' },
    { reps: 30, load: null, unit: null, movement: 'du' },
    { reps: 'Max', load: null, unit: null, movement: 'jumping-jacks' },
    { reps: 100, load: null, unit: null, movement: 'pull-ups' },
    { reps: 100, load: null, unit: null, movement: 'push ups' },
    { reps: 100, load: null, unit: null, movement: 'sit ups' },
    { reps: 100, load: null, unit: null, movement: 'back   squats' },
    { reps: 100, load: null, unit: null, movement: 'Squat' },
    { reps: 100, load: null, unit: null, movement: 'air-Squat' },
    { reps: 'Max', load: null, unit: null, movement: 'box-jumps' },
  ];

  input.forEach((line, index) => {
    let parsed = parseRepsInfo(line);
    // console.log(`${index}: ${line}  ||  `, parsed);
    if (parsed === null) {
      assert.strictEqual(output[index], null);
    } else {
      assert.strictEqual(output[index].reps, parsed.reps, `Reps don't match at ${index}`);
      assert.strictEqual(output[index].load, parsed.load, `Load doesn't match at ${index}`);
      assert.strictEqual(output[index].unit, parsed.unit, `Unit doesn't match at ${index}`);
      assert.strictEqual(output[index].rounds, parsed.rounds, `Rounds don't match at ${index}`);
      assert.strictEqual(output[index].movement, parsed.movement, `Movement doesn't match at ${index}`);
    }
  });
  // let parsed = parse(input[3]);
  // console.log(`3: ${input[3]}  ||  `, parsed);
});

$test.it('should parse movements', () => {
  let input = [
    ' pull-ups ', //0
    'push-ups', //1
    'handstand hold', //2
    'pull-ups', //3
    'sprint', //4
    'Run', //5
    'row', //6
    'ring L-sit', //7
    'dumbbell farmers carry', //8
    'Row', //9
    'row', //10
    'pull-ups',
    'rows',
    'row',
    'bodyweight deadlifts',
    'box jumps',
    'box',
    'Deadlifts',
    'Burpees',
    'Power Cleans',
    'handstand hold',
    'squats',
    'handstand walk',
    'squats',
    'handstand push-ups',
    'walking lunge steps',
    'chest-to-bar pull-ups',
    'box jumps',
    'triple-unders',
    'back extensions',
    'ring dips',
    'knees-to-elbows',
    'wall-ball "2-fer-1s"',
    'sit-ups',
    'rope climbs, 15 ft.',
    'Dumbbell    Thrusters',
    'Toes-to-bars',
    'double-unders',
    'du',
    'jumping-jacks',
    'pull-ups',
    'push ups',
    'sit ups',
    'back   squats',
    'Squat',
    'air-Squat',
    'box-jumps',
  ];
  let output = [
    { _id: 6, name: 'Pull-Up', regexTerms: ['(pull)(s*)', '(up)(s*)'], demolink: 'https://youtube.com/5', modality: 'g', units: [] },
    { _id: 7, name: 'Push-Up', regexTerms: ['(push)(s*)', '(up)(s*)'], demolink: 'https://youtube.com/7', modality: 'g', units: [] },
    { _id: 24, name: 'Handstand Hold', regexTerms: ['(handstand)(s*)', '(hold)(s*)'], demolink: 'https://youtube.com/23', modality: 'g', units: ['second', 'minute', 'hour'] },
    { _id: 6, name: 'Pull-Up', regexTerms: ['(pull)(s*)', '(up)(s*)'], demolink: 'https://youtube.com/5', modality: 'g', units: [] },
    null,
    null,
    { _id: 32, name: 'Row', regexTerms: ['(row|rowing)(s*)'], demolink: 'https://youtube.com/32', modality: 'g', units: [] },
    null,
    null,
    { _id: 32, name: 'Row', regexTerms: ['(row|rowing)(s*)'], demolink: 'https://youtube.com/32', modality: 'g', units: [] },
    { _id: 32, name: 'Row', regexTerms: ['(row|rowing)(s*)'], demolink: 'https://youtube.com/32', modality: 'g', units: [] },
    { _id: 6, name: 'Pull-Up', regexTerms: ['(pull)(s*)', '(up)(s*)'], demolink: 'https://youtube.com/5', modality: 'g', units: [] },
    { _id: 32, name: 'Row', regexTerms: ['(row|rowing)(s*)'], demolink: 'https://youtube.com/32', modality: 'g', units: [] },
    { _id: 32, name: 'Row', regexTerms: ['(row|rowing)(s*)'], demolink: 'https://youtube.com/32', modality: 'g', units: [] },
    { _id: 33, name: 'Bodyweight Deadlifts', regexTerms: ['(bodyweight)(s*)', '(deadlift)(s*)'], demolink: 'https://youtube.com/33', modality: 'w', units: ['lb', 'kg'] },
    { _id: 16, name: 'Box Jump', regexTerms: ['(box)(s*)', '(jump)(s*)'], demolink: 'https://youtube.com/16', modality: 'g', units: [] },
    null,
    { _id: 29, name: 'Deadlifts', regexTerms: ['(deadlift)(s*)'], demolink: 'https://youtube.com/29', modality: 'w', units: ['lb', 'kg'] },
    { _id: 31, name: 'Burpees', regexTerms: ['(burpee)(s*)'], demolink: 'https://youtube.com/31', modality: 'g', units: [] },
    { _id: 30, name: 'Power Cleans', regexTerms: ['(power)(s*)', '(clean)(s*)'], demolink: 'https://youtube.com/30', modality: 'w', units: ['lb', 'kg'] },
    { _id: 24, name: 'Handstand Hold', regexTerms: ['(handstand)(s*)', '(hold)(s*)'], demolink: 'https://youtube.com/23', modality: 'g', units: ['second', 'minute', 'hour'] },
    { _id: 10, name: 'Squat', regexTerms: ['(squat)(s*)'], demolink: 'https://youtube.com/10', modality: 'g', units: [] },
    { _id: 25, name: 'Handstand Walk', regexTerms: ['(handstand)(s*)', '(walk)(s*)'], demolink: 'https://youtube.com/25', modality: 'g', units: ['ft', 'meter', 'yards'] },
    { _id: 10, name: 'Squat', regexTerms: ['(squat)(s*)'], demolink: 'https://youtube.com/10', modality: 'g', units: [] },
    { _id: 27, name: 'Handstand Push-Up', regexTerms: ['(handstand)(s*)', '(push)(s*)', '(up)(s*)'], demolink: 'https://youtube.com/27', modality: 'g', units: ['ft', 'meter', 'yards'] },
    { _id: 14, name: 'Walking Lunge Steps', regexTerms: ['(walking|walk)(s*)', '(lung|lunge)(s*)', '(step)(s*)'], demolink: 'https://youtube.com/14', modality: 'g', units: [] },
    { _id: 15, name: 'Chest to Bar Pull-Up', regexTerms: ['(chest)(s*)', '(to)(s*)', '(bar)(s*)', '(pull)(s*)', '(up)(s*)'], demolink: 'https://youtube.com/15', modality: 'g', units: [] },
    { _id: 16, name: 'Box Jump', regexTerms: ['(box)(s*)', '(jump)(s*)'], demolink: 'https://youtube.com/16', modality: 'g', units: [] },
    { _id: 17, name: 'Triple-Under', regexTerms: ['(triple)(s*)', '(under)(s*)'], demolink: 'https://youtube.com/17', modality: 'g', units: [] },
    { _id: 18, name: 'Back Extension', regexTerms: ['(back)(s*)', '(extension)(s*)'], demolink: 'https://youtube.com/18', modality: 'g', units: [] },
    { _id: 19, name: 'Ring Dip', regexTerms: ['(ring)(s*)', '(dip)(s*)'], demolink: 'https://youtube.com/19', modality: 'g', units: [] },
    { _id: 20, name: 'Knees-to-Elbow', regexTerms: ['(knee)(s*)', '(to)(s*)', '(elbow)(s*)'], demolink: 'https://youtube.com/20', modality: 'g', units: [] },
    { _id: 21, name: 'Wall-Ball "2-fer-1s"', regexTerms: ['(wall)(s*)', '(ball)(s*)', '("2|2|two)(s*)', '(fer)(s*)', '(one|1|1")(s*)'], demolink: 'https://youtube.com/21', modality: 'g', units: ['lb', 'kg'] },
    { _id: 9, name: 'Sit-up', regexTerms: ['(sit|sat)(s*)', '(up)(s*)'], demolink: 'https://youtube.com/9', modality: 'g', units: [] },
    { _id: 22, name: 'Rope Climb 15 ft', regexTerms: ['(rope)(s*)', '(climb|climb)(s*)', '(15)', '(ft|ft.)(s*)'], demolink: 'https://youtube.com/22', modality: 'g', units: ['ft', 'meter', 'yards'] },
    { _id: 2, name: 'Dumbbell Thruster', regexTerms: ['(db|dumbbell|dumbell|dumbel)(s*)', '(thruster)(s*)'], demolink: 'https://youtube.com/2', modality: 'w', units: ['lb', 'kg'] },
    { _id: 3, name: 'Toes-to-bar', regexTerms: ['(toe)(s*)', '(to)(s*)', '(bar)(s*)'], demolink: 'https://youtube.com/3', modality: 'g', units: [] },
    { _id: 4, name: 'Double-Unders', regexTerms: ['(double)(s*)', '(under)(s*)'], demolink: 'https://youtube.com/4', modality: 'g', units: [] },
    { _id: 13, name: 'Double-Unders', regexTerms: ['(du)(s*)'], demolink: 'https://youtube.com/4', modality: 'g', units: [] },
    { _id: 8, name: 'Jumping Jacks', regexTerms: ['(jumping|jump|jumped|juming)(s*)', '(jack|jac|jak)(s*)'], demolink: 'https://youtube.com/8', modality: 'g', units: [] },
    { _id: 6, name: 'Pull-Up', regexTerms: ['(pull)(s*)', '(up)(s*)'], demolink: 'https://youtube.com/5', modality: 'g', units: [] },
    { _id: 7, name: 'Push-Up', regexTerms: ['(push)(s*)', '(up)(s*)'], demolink: 'https://youtube.com/7', modality: 'g', units: [] },
    { _id: 9, name: 'Sit-up', regexTerms: ['(sit|sat)(s*)', '(up)(s*)'], demolink: 'https://youtube.com/9', modality: 'g', units: [] },
    { _id: 12, name: 'Back Squat', regexTerms: ['(back)(s*)', '(squat)(s*)'], demolink: 'https://youtube.com/12', modality: 'w', units: ['lb', 'kg'] },
    { _id: 10, name: 'Squat', regexTerms: ['(squat)(s*)'], demolink: 'https://youtube.com/10', modality: 'g', units: [] },
    { _id: 11, name: 'Air Squat', regexTerms: ['(air)(s*)', '(squat)(s*)'], demolink: 'https://youtube.com/11', modality: 'g', units: [] },
    { _id: 16, name: 'Box Jump', regexTerms: ['(box)(s*)', '(jump)(s*)'], demolink: 'https://youtube.com/16', modality: 'g', units: [] },
  ];

  input.forEach((movementString, index) => {
    let parsed = parseMovementString(movementString);
    if (parsed === null) {
      assert.strictEqual(output[index], null, `Parsed is not null at ${index}`);
    } else {
      assert.strictEqual(parsed._id, output[index]._id, `_id don't match at ${index}`);
      assert.strictEqual(parsed.name, output[index].name, `name don't match at ${index}`);
      assert.strictEqual(parsed.regexTerms.length, output[index].regexTerms.length, `regexTerms length don't match at ${index}`);
      assert.strictEqual(parsed.demolink, output[index].demolink, `demolink don't match at ${index}`);
      assert.strictEqual(parsed.modality, output[index].modality, `modality don't match at ${index}`);
      assert.strictEqual(parsed.units.length, output[index].units.length, `units length don't match at ${index}`);
    }
  });
  // console.log(input[34], parseMovementString(input[34]));
});

$test.it('should parse workout desc', () => {
  data.forEach((item, index) => {
    let workout = parseWorkout(item.input);
    assert.strictEqual(workout.parsedMovements.length, data[index].totalMovements, `totalMovements don't match at ${index}`);
  });
  // console.log(parseWorkout(data[1].input));
});
console.groupEnd();
