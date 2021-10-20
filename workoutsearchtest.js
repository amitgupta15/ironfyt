'use strict';
const $test = require('./vendor/nodejs-unit-test-library');
const { assert, it } = $test;
console.group('\x1b[33m%s\x1b[0m', 'Workout Desc parse tests');

let data = require('./testdata');
let { parseWorkoutDesc, parseLoadInfo } = require('./helpers/parse-workout-desc');

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

$test.it('should parse amrap description - Ex: 10 pull-ups', () => {
  for (let i = 0; i < data.length; i++) {
    let result = parseWorkoutDesc(data[i].input);
    assert.equal(result.workoutDesc, data[i].output, `Workout Desc not as expected at: ${i}`);
    assert.equal(result.factoredMovements.length, data[i].totalMovements, `Total Movements not as expected at: ${i}`);
    assert.equal(result.loadInfoArray.length, data[i].loadInfoLength, `Load Info length is not as expected at: ${i}`);
  }
});

console.groupEnd();
