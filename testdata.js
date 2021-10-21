let testData = [
  {
    //0
    input: `Complete as many rounds as possible of<br/>\n\n4 Dumbbell    Thrusters\n6 Toes-to-bars\n24 double-unders\n30 du\nMax jumping-jacks\n100 pull-ups\n100 push ups\n100 sit ups\n100 back   squats\n100 Squat\n100 air-Squat\nmax box-jumps\n\nFemale: 35-lb. dumbbell, Male: 50-lb. dumbbells.\n\nPost rounds completed.<br/>\n`,
    output: `Complete as many rounds as possible of<br/>\n\n4 Dumbbell Thruster [<a href="https://youtube.com/2">Demo</a>]\n6 Toes-to-bar [<a href="https://youtube.com/3">Demo</a>]\n24 Double-Unders [<a href="https://youtube.com/4">Demo</a>]\n30 Double-Unders [<a href="https://youtube.com/4">Demo</a>]\nMax Jumping Jacks [<a href="https://youtube.com/8">Demo</a>]\n100 Pull-Up [<a href="https://youtube.com/5">Demo</a>]\n100 Push-Up [<a href="https://youtube.com/7">Demo</a>]\n100 Sit-up [<a href="https://youtube.com/9">Demo</a>]\n100 Back Squat [<a href="https://youtube.com/12">Demo</a>]\n100 Squat [<a href="https://youtube.com/10">Demo</a>]\n100 Air Squat [<a href="https://youtube.com/11">Demo</a>]\nmax Box Jump [<a href="https://youtube.com/16">Demo</a>]\n\nFemale: 35-lb. dumbbell, Male: 50-lb. dumbbells.\n\nPost rounds completed.<br/>\n`,
    totalMovements: 12,
    loadInfoLength: 2,
  },
  {
    //1
    input: `50 walking lunge steps\n25 chest-to-bar pull-ups\n50 box jumps\n25 triple-unders\n50 back extensions\n25 ring dips\n50 knees-to-elbows\n25 wall-ball "2-fer-1s"\n50 sit-ups\n5 rope climbs, 15 ft.\n\n♀ 20-in. box, 14-lb. ball\n♂ 24-in. box, 20-lb. ball\n\nPost time`,
    output:
      '50 Walking Lunge Steps [<a href="https://youtube.com/14">Demo</a>]\n25 Chest to Bar Pull-Up [<a href="https://youtube.com/15">Demo</a>]\n50 Box Jump [<a href="https://youtube.com/16">Demo</a>]\n25 Triple-Under [<a href="https://youtube.com/17">Demo</a>]\n50 Back Extension [<a href="https://youtube.com/18">Demo</a>]\n25 Ring Dip [<a href="https://youtube.com/19">Demo</a>]\n50 Knees-to-Elbow [<a href="https://youtube.com/20">Demo</a>]\n25 Wall-Ball "2-fer-1s" [<a href="https://youtube.com/21">Demo</a>]\n50 Sit-up [<a href="https://youtube.com/9">Demo</a>]\n5 Rope Climb 15 ft [<a href="https://youtube.com/22">Demo</a>]\n\n♀ 20-in. box, 14-lb. ball\n♂ 24-in. box, 20-lb. ball\n\nPost time',
    totalMovements: 10,
    loadInfoLength: 4,
  },
  {
    //2
    input: `3-minute handstand hold\n100 squats\n50-meter handstand walk\n100 squats\n30 handstand push-ups`,
    output:
      '3-minute Handstand Hold [<a href="https://youtube.com/23">Demo</a>]\n100 Squat [<a href="https://youtube.com/10">Demo</a>]\n50-meter Handstand Walk [<a href="https://youtube.com/25">Demo</a>]\n100 Squat [<a href="https://youtube.com/10">Demo</a>]\n30 Handstand Push-Up [<a href="https://youtube.com/27">Demo</a>]',
    totalMovements: 5,
    loadInfoLength: 0,
  },
  {
    //3
    input: `9 Deadlifts\n6 Burpees\n3 Power Cleans\n\n♀ 95 lb. ♂ 135 lb.\n\nPost completed rounds`,
    output: '9 Deadlifts [<a href="https://youtube.com/29">Demo</a>]\n' + '6 Burpees [<a href="https://youtube.com/31">Demo</a>]\n' + '3 Power Cleans [<a href="https://youtube.com/30">Demo</a>]\n' + '\n' + '♀ 95 lb. ♂ 135 lb.\n' + '\n' + 'Post completed rounds',
    totalMovements: 3,
    loadInfoLength: 2,
  },
  {
    //4
    input: `500-m row\n12 bodyweight deadlifts\n21 box jumps\n\n20-in. box\n\nPost time`,
    output: '500-m Row [<a href="https://youtube.com/32">Demo</a>]\n' + '12 Bodyweight Deadlifts [<a href="https://youtube.com/33">Demo</a>]\n' + '21 Box Jump [<a href="https://youtube.com/16">Demo</a>]\n' + '\n' + '20-in. box\n' + '\n' + 'Post time',
    totalMovements: 3,
    loadInfoLength: 0,
  },
];

module.exports = testData;
