let testData = [
  {
    //0
    input: `Complete as many rounds as possible of<br/>

            4 Dumbbell    Thrusters
            6 Toes-to-bars
            24 double-unders
            30 du
            Max jumping-jacks
            100 pull-ups
            100 push ups
            100 sit ups
            100 back   squats
            100 Squat
            100 air-Squat
            max box-jumps

            Female: 35-lb. dumbbell, Male: 50-lb. dumbbells.
            
            Post rounds completed.<br/>
  `,
    output: `Complete as many rounds as possible of<br/>

4 Dumbbell Thruster [<a href="https://youtube.com/2">Demo</a>]
6 Toes-to-bar [<a href="https://youtube.com/3">Demo</a>]
24 Double-Unders [<a href="https://youtube.com/4">Demo</a>]
30 Double-Unders [<a href="https://youtube.com/4">Demo</a>]
Max Jumping Jacks [<a href="https://youtube.com/8">Demo</a>]
100 Pull-Up [<a href="https://youtube.com/5">Demo</a>]
100 Push-Up [<a href="https://youtube.com/7">Demo</a>]
100 Sit-up [<a href="https://youtube.com/9">Demo</a>]
100 Back Squat [<a href="https://youtube.com/12">Demo</a>]
100 Squat [<a href="https://youtube.com/10">Demo</a>]
100 Air Squat [<a href="https://youtube.com/11">Demo</a>]
max Box Jump [<a href="https://youtube.com/16">Demo</a>]

Female: 35-lb. dumbbell, Male: 50-lb. dumbbells.

Post rounds completed.<br/>
`,
    totalMovements: 12,
    loadInfoLength: 2,
  },
  {
    //1
    input: `50 walking lunge steps
    25 chest-to-bar pull-ups
    50 box jumps
    25 triple-unders
    50 back extensions
    25 ring dips
    50 knees-to-elbows
    25 wall-ball "2-fer-1s"
    50 sit-ups
    5 rope climbs, 15 ft.

    ♀ 20-in. box, 14-lb. ball
    ♂ 24-in. box, 20-lb. ball

    Post time`,
    output:
      '50 Walking Lunge Steps [<a href="https://youtube.com/14">Demo</a>]\n' +
      '25 Chest to Bar Pull-Up [<a href="https://youtube.com/15">Demo</a>]\n' +
      '50 Box Jump [<a href="https://youtube.com/16">Demo</a>]\n' +
      '25 Triple-Under [<a href="https://youtube.com/17">Demo</a>]\n' +
      '50 Back Extension [<a href="https://youtube.com/18">Demo</a>]\n' +
      '25 Ring Dip [<a href="https://youtube.com/19">Demo</a>]\n' +
      '50 Knees-to-Elbow [<a href="https://youtube.com/20">Demo</a>]\n' +
      '25 Wall-Ball "2-fer-1s" [<a href="https://youtube.com/21">Demo</a>]\n' +
      '50 Sit-up [<a href="https://youtube.com/9">Demo</a>]\n' +
      '5 Rope Climb 15 ft [<a href="https://youtube.com/22">Demo</a>]\n' +
      '\n' +
      '♀ 20-in. box, 14-lb. ball\n' +
      '♂ 24-in. box, 20-lb. ball\n' +
      '\n' +
      'Post time',
    totalMovements: 10,
    loadInfoLength: 4,
  },
];

module.exports = testData;
