'use strict';

let localdb = require('./vendor/local-db');

localdb.setCollections({
  users: [
    {
      _id: 1,
      username: 'amitgupta15@gmail.com',
      password: '',
      fname: 'Amit',
      lname: 'Gupta',
      workouts: [1, 2, 3, 4],
      logs: [],
    },
  ],
  workouts: [
    { _id: 1, user_id: 1, name: 'Workout 20.2', type: 'AMRAP', rounds: null, timecap: '20 minutes', description: '4 dumbbell thrusters\n6 toes-to-bars\n24 double-unders\n\nFemale: 35-lb. dumbbell, Male: 50-lb. dumbbells.\n\n Post rounds completed.<br/>' },
    { _id: 2, user_id: 1, name: 'Thursday 191017', type: 'For Time', rounds: null, timecap: null, description: '100 hip-extensions\n\nEach time you break a set or rest at the bottom, stop and perform 15 wall-ball-shots\n\nPost time.' },
    { _id: 3, user_id: 1, name: 'Sunday 191020', type: 'For Load', rounds: '3-3-3-3-3', timecap: null, description: 'Sumo deadlift\n\nPractice SLIPS for 20 minutes.\n\nPost loads.' },
    { _id: 4, user_id: 1, name: 'Monday 191014', type: 'For Time', rounds: 5, timecap: null, description: '50 double-under\n20 sumo deadlift high pull\n20 GHD sit-up\n20-cal. row\n\n♀ 55 lb. ♂ 75 lb.\n\nPost time.' },
  ],
  logs: [],
});
