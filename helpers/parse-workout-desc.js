'use strict';

/**
 *
 * @param {String} line - Workout line to be parsed such as "100 pull-ups"
 * @returns parsed object containing reps, load, unit, movement and rounds info
 */
let parseRepsInfo = (line) => {
  //Remove leading and trailing white space from the line
  line = line.trim();
  //Regex to check if the line has reps and movement information
  let repsAndMovementCheckRegex = new RegExp(/^((\d+,*)+|row|run|max)(\s|-[a-zA-Z]+)/i);
  if (repsAndMovementCheckRegex.test(line)) {
    //Replace prepositions such as of and for with single white space
    let lineWithoutPrepositions = line.replace(new RegExp(/\sof\s|\sfor\s/i), ' ');
    //Split the line into tokens
    let tokens = lineWithoutPrepositions.split(' ');
    //Convert a number like 1,000 to 1000
    tokens[0] = tokens[0].replace(',', '');
    //Check if token[0] is of type 300-m, 1,000-ft, 30-seconds, etc.
    let hyphenatedFirstTokenRegex = new RegExp(/^(\d+,*)+-[a-zA-Z]+/i);
    if (hyphenatedFirstTokenRegex.test(tokens[0])) {
      //token[0] has the load and rep info like 300 m or 30 seconds
      let loadInfo = tokens[0].split('-');
      //index 1 will always have the unit in this case
      let unit = loadInfo[1];
      let reps = null;
      let load = null;
      //If unit is a time component then store loadInfo[0] as load otherwise, store loadInfo[0] as reps
      if (new RegExp(/(second|sec|min|minute|hr|hour)(\b|s\b)/i).test(loadInfo[1])) {
        load = parseInt(loadInfo[0]);
      } else {
        reps = parseInt(loadInfo[0]);
      }
      //Remove the reps info at tokens[0] so that only movement information is left in the tokens array
      tokens.splice(0, 1);
      //Get the movement string
      let movement = tokens.join(' ');
      return { reps, load, unit, movement };
      //Check if the line starts with run or row
    } else if (['run', 'row'].indexOf(tokens[0].toLowerCase()) > -1) {
      //Movement will always be at index 0
      let movement = tokens[0];
      //load will be at index 1 - Run 500 meters
      let load = parseInt(tokens[1]);
      //Unit will be at index 2 - Row 300 cal
      let unit = tokens[2];
      return { reps: null, load, unit, movement };
      //Check if the second token is "rounds" as in 3 rounds
    } else if (tokens[1].trim().toLowerCase() === 'rounds') {
      return { rounds: parseInt(tokens[0]) };
      //Check if the tokens[1] is duration or distance as in 20 seconds of pull-ups
    } else if (new RegExp(/^(second|sec|cal|calorie|min|minute|hr|hour|f(oo|ee)t|ft|yard)(\b|s\b)/i).test(tokens[1])) {
      let load = null;
      let reps = null;
      let unit = tokens[1];
      //If unit is a time component then store loadInfo[0] as load otherwise, store loadInfo[0] as reps
      if (new RegExp(/(second|sec|min|minute|hr|hour)(\b|s\b)/i).test(unit)) {
        load = parseInt(tokens[0]);
      } else {
        reps = parseInt(tokens[0]);
      }
      let movement = tokens[2];
      return { reps, load, unit, movement };
      //Catch all - tokens[0] is reps and tokens[1] is movement
    } else {
      let reps = tokens[0].toLowerCase() === 'max' ? 'Max' : parseInt(tokens[0]);
      let load = null;
      let unit = null;
      tokens.splice(0, 1);
      let movement = tokens.join(' ');
      return { reps, load, unit, movement };
    }
  }
  //Check for string like "Shoulder Press 5-5-5-5-5 reps"
  let movementAndRepsCheckRegex = new RegExp(/^[a-zA-Z]+(\s[a-zA-Z]+)*\s(\d+-)+\d+/i);
  if (movementAndRepsCheckRegex.test(line)) {
    let tokens = line.split(' ');
    //Regex to find the reps like "5-5-5-5-5"
    let repsRegex = new RegExp(/(\d+-)+\d+/i);

    let token;
    //pop() remove the last item from the array and assign it to token. Check if the token is like "5-5-5-5-5". If not keep popping
    while (!repsRegex.test(token)) {
      token = tokens.pop();
    }
    //Once the reps pattern is found, create the reps array
    let reps = token.split('-').map((rep) => parseInt(rep));
    //Get the movement from the tokens array
    let movement = tokens.join(' ');
    return { reps, load: null, unit: [], movement };
  }
  return null;
};

/**
 * Matches a string against movement database
 * @param {String} movementString movement string such as "dumbbell push-ups"
 * @param {Array} movements movements to check against
 * @returns movement object from the database
 */
let parseMovementString = (movementString, movements = []) => {
  //Remove leading and trailing white spaces
  let trimmedMovementString = movementString.trim();
  //Remove any comma
  let movementStringNoComma = trimmedMovementString.replace(new RegExp(/,|[.]/g), '');
  //Remove extra white space and hyphens between the words
  let sanitizedString = movementStringNoComma.replace(new RegExp(/\s+|-/g), ' ');
  //Create tokens from the string
  let tokens = sanitizedString.split(' ');
  //Get a subset of movements whose regex terms array is the same size as tokens array
  let filteredMovements = movements.filter((movement) => movement.regexTerms.length === tokens.length);
  let parsedMovement = null;
  if (filteredMovements.length) {
    filteredMovements.forEach((movement) => {
      //Create a regular expression like new RegExp(/(dumbbell|db|dumbell)(s*) (thruster)(s*)/);
      let regex = new RegExp(movement.regexTerms.join(' '), 'i');
      let match = sanitizedString.toLowerCase().match(regex);
      if (match) parsedMovement = movement;
    });
  }
  return parsedMovement;
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
 * Main method. workoutString is parsed for reps, load, etc.
 * Call this method from the code to parse a workout input of the type
 * 100 push-ups
 * 200 sit-ups
 * Male: 50-lb DB
 * Female: 30-lb DB
 * @param {String} workoutString
 * @param {Array} movements - movements db to check against
 * @returns object containing parsedMovements, updated workoutDesc and parsed loadinfo
 */
let parseWorkout = (workoutString, movements = []) => {
  let splitInput = workoutString.split('\n');
  let parsedMovements = [];
  let parsedLoadInfo = [];
  splitInput.forEach((line, index) => {
    let parsed = parseRepsInfo(line);
    if (parsed !== null) {
      let movementObj = parseMovementString(parsed.movement, movements);
      if (movementObj !== null) {
        parsed.movementObj = movementObj;
        parsedMovements.push(parsed);
        splitInput[index] = `${parsed.reps ? parsed.reps : parsed.load ? parsed.load : ''}${parsed.unit ? `-${parsed.unit}` : ``} ${parsed.movementObj.name} [<a href="${parsed.movementObj.demolink}">Demo</a>]`;
      }
    }
    let loadInfo = parseLoadInfo(line);
    if (loadInfo) {
      parsedLoadInfo = parsedLoadInfo.concat(loadInfo);
    }
  });
  return { parsedMovements, workoutDesc: splitInput.join('\n'), parsedLoadInfo };
};
module.exports = { parseRepsInfo, parseLoadInfo, parseMovementString, parseWorkout };
