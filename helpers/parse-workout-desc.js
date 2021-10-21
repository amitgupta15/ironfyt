'use strict';
let movements = require('./movements.json'); // regexTerms stores the term possibilities for each word of the movement
/**
 * Parses an array of lines to extract reps and movements info. Enhances the original workout description by replacing proper movement name with demo video link, etc.
 * @param {Array} descArray is an array of strings. Strings need to be cleaned up by the caller to make sure there are no leading white spaces
 * @returns { Object } object containing an Array of factored reps and movements, and enhanced workout desc {factoredMovements, workoutDesc}
 */
let parseWorkout = (descArray) => {
  //Make a copy of the array before removing spaces between words and hyphens
  //Copy is used to put back the description string with annotations
  let descArrayOriginalCopy = descArray;

  let factoredMovements = [];

  descArray.forEach((line, index) => {
    //For each line, look for a pattern like: 100 pull-ups, Max push-ups where rep count is followed by movement name
    let isRepFollowedByMovement = new RegExp(/^(\d+|max)\s+[a-zA-Z]+/i);
    //For each line, look for a pattern like: 3-minute handstand hold
    let isRepFollowedByUnitFollowedByMovement = new RegExp(/^\d+-[a-zA-Z]+/i);

    if (isRepFollowedByMovement.test(line) || isRepFollowedByUnitFollowedByMovement.test(line)) {
      //Remove extra white space and hyphen from the line
      let sanitizedLine = line.replace(new RegExp(/\s+|-/g), ' ');
      let lineArray = sanitizedLine.split(' ');
      //Rep will always be in the position 0
      let reps = lineArray[0];
      //Remove the reps from the array
      lineArray.splice(0, 1);

      let unit = null;
      //If the line is of type 3-minute handstand hold, then extract the unit
      if (isRepFollowedByUnitFollowedByMovement.test(line)) {
        unit = lineArray[0];
        //Remove the unit from the array
        lineArray.splice(0, 1);
      }
      //Filter the movements array to get all the movements where the term count matches the lineArray length
      //This will take care of the issue of "clean" vs. "squat clean"
      let filteredMovements = movements.filter((movement) => movement.regexTerms.length === lineArray.length);
      if (filteredMovements.length) {
        filteredMovements.forEach((movement) => {
          //Create a regular expression like new RegExp(/(dumbbell|db|dumbell)(s*) (thruster)(s*)/);
          let regex = new RegExp(movement.regexTerms.join(' '), 'i');
          //Create the movement string
          let movementString = lineArray.join(' ');
          let match = movementString.match(regex);
          if (match) {
            let movementToReplace = `${reps}${unit ? `-${unit}` : ``} ${movement.name} [<a href="${movement.demolink}">Demo</a>]`;
            //Replace the new string with the existing string at the index
            descArrayOriginalCopy.splice(index, 1, movementToReplace);
            factoredMovements.push({ reps, terms: lineArray, movement, unit });
          }
        });
      }
    }
  });
  let workoutDesc = descArrayOriginalCopy.join('\n');
  return { factoredMovements, workoutDesc };
};

/**
 * Parses a given string to extract the load information
 * @param {String} desc - description string to be parsed for load information
 * @returns {Array} array containing load information
 */
let parseLoadInfo = (desc) => {
  //Almost always the load information string starts with gender information. Check if the string starts with gender information.
  let genderInfoRegex = new RegExp(/^(♀|♂|(m|f|w)( |:)|female|male|m(e|a)n|wom(e|a)n)/gim);
  //Initialize the loadInfoArray to store the load information
  let loadInfoArray = [];
  //Check is the input string starts with gender information
  if (genderInfoRegex.test(desc)) {
    //If match is found then remove any extra white space and hyphens
    desc = desc.replace(new RegExp(/\s|-/gm), ' ');
    //Remove any , or . or : from the string
    desc = desc.replace(new RegExp(/,|[.]|:/gim), '');
    //Split the string
    desc = desc.split(' ');
    //The minimum length of the desc array has to be 3. Gender (0), load (1), unit (2) is the minimum requirement
    while (desc.length >= 3) {
      let gender = null;
      //If gender info is present and retrieve the gender info and remove the element at 0 position
      //Otherwise, get the gender information from the loadInfoArray. This is required for situations where multiple loads are specified
      if (new RegExp(/♀|♂|^m|^f|w|female|male|m(e|a)n|wom(e|a)n/gim).test(desc[0])) {
        //0 position is always gender
        gender = ['♀', 'f', 'female', 'women', 'woman', 'w'].indexOf(desc[0].toLowerCase()) > -1 ? 'f' : 'm';
        //After retreiving the gender, remove the first element from the array
        desc.splice(0, 1);
      } else if (loadInfoArray.length) {
        gender = loadInfoArray[0].gender;
      }
      //retrieve load information
      let load = parseInt(desc[0]);
      //retrieve unit information
      let unit = desc[1].toLowerCase();
      let equipment = null;
      //If the updated array has 3 or more items then check if gender information is at position 2 or just a string.
      if (desc.length >= 3) {
        //If not gender and assuming it is equipment. This will be the case in most of the cases.
        //It is a harmless assumption because if the string in position 2 is not equipment, it will not match a list of equipments and will be ignored.
        if (!new RegExp(/♀|♂|^m|^f|w|female|male|m(e|a)n|wom(e|a)n/gim).test(desc[2])) {
          equipment = desc[2].toLowerCase();
        }
      }
      // insert a new object in loadInfoArray. Check to make sure load is a number before storing the info in loadInfoArray
      // The check will not push another row for situation like this: `♀ 75 lb. (Virtual Games use 65 lb.)`
      if (!isNaN(load)) loadInfoArray.push({ gender, load, unit, equipment });
      //Once the values are extracted from the top 2 or 3 indexes of the desc array, remove those 2 or 3 items.
      desc.splice(0, equipment === null ? 2 : 3);
    }
  }
  return loadInfoArray;
};

/**
 * Default method. Parses the workout desc and returns the result
 * @param {String} desc
 * @returns
 */
let parseWorkoutDesc = (desc) => {
  //Split the lines at new line and store them in an array
  let descArray = desc.split('\n');
  //Remove extra white spaces at the beginning and at the end of the line
  descArray = descArray.map((line) => (line = line.trim()));

  //returns an object that contains factored reps/movements and updated workout desc
  let { factoredMovements, workoutDesc } = parseWorkout(descArray);

  let loadInfoArray = [];
  descArray.forEach((desc) => {
    let loadInfo = parseLoadInfo(desc);
    if (loadInfo.length) {
      loadInfoArray = loadInfoArray.concat(loadInfo);
    }
  });
  return { factoredMovements, workoutDesc, loadInfoArray };
};

module.exports = { parseWorkoutDesc, parseLoadInfo };
