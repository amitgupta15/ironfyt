'use strict';
// regexTerms stores the term possibilities for each word of the movement
let movements = [
  { _id: 1, name: 'Thruster', regexTerms: ['(thruster)(s*)'], demolink: 'https://youtube.com/1' },
  { _id: 2, name: 'Dumbbell Thruster', regexTerms: ['(db|dumbbell|dumbell|dumbel)(s*)', '(thruster)(s*)'], demolink: 'https://youtube.com/2' },
  { _id: 3, name: 'Toes-to-bar', regexTerms: ['(toe)(s*)', '(to)(s*)', '(bar)(s*)'], demolink: 'https://youtube.com/3' },
  { _id: 4, name: 'Double-Unders', regexTerms: ['(double)(s*)', '(under)(s*)'], demolink: 'https://youtube.com/4' },
  { _id: 4, name: 'Double-Unders', regexTerms: ['(du)(s*)'], demolink: 'https://youtube.com/4' },
];
let amrap1 = `Complete as many rounds as possible of<br/>
  4 dumbbell    thrusters
  6 toes-to-bars
  24 double-unders
  Max jumping-jacks
  100 pull-ups
  100 push ups
  100 sit ups
  100 squats
  Female: 35-lb. dumbbell, Male: 50-lb. dumbbells.

  Post rounds completed.<br/>`;

let original = amrap1;

//Remove 2 or more new lines so that the description is formatted with single line vertical spacing
amrap1 = amrap1.replace(new RegExp(/\n{2,}/gm), '\n');
//Split the lines at new line and store them in an array
amrap1 = amrap1.split('\n');
//Remove extra spaces and remove any hyphens (-) from each line entry
amrap1 = amrap1.map((line) => line.replace(new RegExp(/\s+|-/gm), ' '));

let factoredMovements = [];
//This for loop iterates through all the lines in the description
for (let i = 0; i < amrap1.length; i++) {
  let line = amrap1[i].trim().toLowerCase();
  //For each line, look for a pattern like: 100 pull-ups, Max push-ups where rep count is followed by movement name
  let isRepFollowedByMovement = new RegExp(/^(\d+|max)\s+[a-zA-Z]+/gim);
  if (isRepFollowedByMovement.test(line)) {
    console.log('Line: ' + line);
    //Create a line array
    let lineArray = line.split(' ');
    //Rep will always be in the position 0
    let reps = lineArray[0];
    //Remove the reps from the array
    lineArray.splice(0, 1);
    //Filter the movements array to get all the movements where the term count matches the lineArray length
    //This will take care of the issue of "clean" vs. "squat clean"
    let filteredMovements = movements.filter((movement) => movement.regexTerms.length === lineArray.length);
    if (filteredMovements.length) {
      filteredMovements.forEach((movement) => {
        //Create a regular expression like new RegExp(/(?<movement>(dumbbell|db|dumbell)(s*) (thruster)(s*))/);
        let regex = new RegExp(movement.regexTerms.join(' '));
        let line = lineArray.join(' ');
        let match = line.match(regex);
        if (match) factoredMovements.push({ reps: reps, movementString: lineArray.join(' '), terms: lineArray, movement });
        console.log(factoredMovements);
      });
    }
  }
}
// console.log(factoredMovements);
