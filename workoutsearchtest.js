'use strict';
// regexTerms stores the term possibilities for each word of the movement
let movements = [
  { _id: 1, name: 'Thruster', regexTerms: ['(thruster)(s*)'], demolink: 'https://youtube.com/1' },
  { _id: 2, name: 'Dumbbell Thruster', regexTerms: ['(db|dumbbell|dumbell|dumbel)(s*)', '(thruster)(s*)'], demolink: 'https://youtube.com/2' },
  { _id: 3, name: 'Toes-to-bar', regexTerms: ['(toe)(s*)', '(to)(s*)', '(bar)(s*)'], demolink: 'https://youtube.com/3' },
  { _id: 4, name: 'Double-Unders', regexTerms: ['(double)(s*)', '(under)(s*)'], demolink: 'https://youtube.com/4' },
  { _id: 6, name: 'Pull-Up', regexTerms: ['(pull)(s*)', '(up)(s*)'], demolink: 'https://youtube.com/5' },
  { _id: 7, name: 'Push-Up', regexTerms: ['(push)(s*)', '(up)(s*)'], demolink: 'https://youtube.com/7' },
  { _id: 8, name: 'Jumping Jacks', regexTerms: ['(jumping|jump|jumped|juming)(s*)', '(jack|jac|jak)(s*)'], demolink: 'https://youtube.com/8' },
  { _id: 9, name: 'Sit-up', regexTerms: ['(sit|sat)(s*)', '(up)(s*)'], demolink: 'https://youtube.com/9' },
  { _id: 10, name: 'Squat', regexTerms: ['(squat)(s*)'], demolink: 'https://youtube.com/10' },
  { _id: 11, name: 'Air Squat', regexTerms: ['(air)(s*)', '(squat)(s*)'], demolink: 'https://youtube.com/11' },
  { _id: 12, name: 'Back Squat', regexTerms: ['(back)(s*)', '(squat)(s*)'], demolink: 'https://youtube.com/12' },
  { _id: 13, name: 'Double-Unders', regexTerms: ['(du)(s*)'], demolink: 'https://youtube.com/4' },
];
let amrap1 = `Complete as many rounds as possible of<br/>

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

  Female: 35-lb. dumbbell, Male: 50-lb. dumbbells.
  
  Post rounds completed.<br/>
  `;
/**
 *
 */
let newParse = () => {
  let original = amrap1;
  //Split the lines at new line and store them in an array
  amrap1 = amrap1.split('\n');
  //Remove extra white spaces at the beginning and at the end of the line
  amrap1 = amrap1.map((line) => (line = line.trim()));
  //Make a copy of the array before removing spaces between words and hyphens
  let amrap1copy = amrap1;
  //Remove extra white space and hyphen from each line
  amrap1 = amrap1.map((line) => line.replace(new RegExp(/\s+|-/gm), ' '));
  let factoredMovements = [];
  amrap1.forEach((line, index) => {
    //For each line, look for a pattern like: 100 pull-ups, Max push-ups where rep count is followed by movement name
    let isRepFollowedByMovement = new RegExp(/^(\d+|max)\s+[a-zA-Z]+/gim);
    if (isRepFollowedByMovement.test(line)) {
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
          //Create a regular expression like new RegExp(/(dumbbell|db|dumbell)(s*) (thruster)(s*)/);
          let regex = new RegExp(movement.regexTerms.join(' '), 'ig');
          //Create the movement string
          let movementString = lineArray.join(' ');
          let match = movementString.match(regex);
          if (match) {
            let movementToReplace = `${reps} ${movement.name} [<a href="${movement.demolink}">Demo</a>]`;
            amrap1copy.splice(index, 1, movementToReplace);
            factoredMovements.push({ reps, terms: lineArray, movement });
          }
        });
      }
    }
  });
  console.log(factoredMovements);
  console.log(amrap1copy.join('\n'));
};
newParse();
