/**
 * Include this js file in any view (HTML) which is providing log search feature.
 */
(function () {
  ('use strict');

  /**
   * This is the main search function which matches the search input value with the logs array to find search results.
   * It displays the search results when a search term is provided. It displays the default template when no search term is provided
   *
   * @param {HTMLDivElement} div - DIV which will show the search results
   * @param {Array} workoutlogs - workoutlogs array to search
   * @param {HTMLInputElement} inputField - Search input field to read the search input from
   * @param {function} defaultPageTemplate - Default page template to call when inputField has no value
   * @param {Object} state - application state object
   */
  $ironfyt.searchWorkoutLogs = function (div, workoutlogs, inputField, defaultPageTemplate, state, ref) {
    let inputFieldValue = inputField.value;
    //If the search input field is empty then show the default view
    if (!inputFieldValue) {
      div.innerHTML = defaultPageTemplate(state);
      return;
    }
    div.innerHTML = `<div id="autocomplete-search-result"></div>`;
    let autocomleteDiv = document.querySelector('#autocomplete-search-result');
    let autocompleteList = '';
    let count = 0;
    for (let i = 0; i < workoutlogs.length; i++) {
      let log = workoutlogs[i];
      let workout = log && log.workout && log.workout.length ? log.workout[0] : {};
      let notes = log.notes ? log.notes : '';
      let notesMatchIndex = getSearchStringMatchIndex(notes, inputFieldValue);

      let workoutName = workout.name ? workout.name : '';
      let workoutNameIndex = getSearchStringMatchIndex(workoutName, inputFieldValue);

      let workoutType = workout.type ? workout.type : '';
      let workoutTypeIndex = getSearchStringMatchIndex(workoutType, inputFieldValue);

      let workoutReps = workout.reps ? workout.reps.toString() : '';
      let workoutRepsIndex = getSearchStringMatchIndex(workoutReps, inputFieldValue);

      let workoutDescription = workout.description ? workout.description : '';
      let workoutDescriptionIndex = getSearchStringMatchIndex(workoutDescription, inputFieldValue);

      let workoutTimecap = workout.timecap ? $ironfyt.formatTimecap(workout.timecap) : '';
      let workoutTimecapIndex = getSearchStringMatchIndex(workoutTimecap, inputFieldValue);

      if (notesMatchIndex > -1 || workoutNameIndex > -1 || workoutTypeIndex > -1 || workoutRepsIndex > -1 || workoutDescriptionIndex > -1 || workoutTimecapIndex > -1) {
        log.notes = log.notes ? getHighligtedAttribute(notesMatchIndex, notes, inputFieldValue) : '';
        workout.name = workoutName.trim() ? getHighligtedAttribute(workoutNameIndex, workoutName, inputFieldValue) : '';
        workout.type = workoutType.trim() ? getHighligtedAttribute(workoutTypeIndex, workoutType, inputFieldValue) : '';
        workout.reps = workoutReps.trim() ? getHighligtedAttribute(workoutRepsIndex, workoutReps, inputFieldValue) : '';
        workout.description = workoutDescription.trim() ? getHighligtedAttribute(workoutDescriptionIndex, workoutDescription, inputFieldValue) : '';
        workout.timecap = workoutTimecap.trim() ? getHighligtedAttribute(workoutTimecapIndex, workoutTimecap, inputFieldValue) : '';

        count++;
        autocompleteList += $ironfyt.displayLogListItemTemplate(log, workout, ref);
      }
    }
    let countString = `<div class="margin-bottom-5px text-color-secondary">Found ${count} Logs</div>`;
    autocomleteDiv.innerHTML = `<div>${countString}${autocompleteList}</div>`;
  };

  /**
   * Utility function normalizes the incoming string attribute and input field value, and compares to find the index of matching text. Returns the index.
   * This function is used by handleSearchLogsEvent()
   * @param {String} attribute
   * @param {String} inputFieldValue
   * @returns index of the matching text
   */
  let getSearchStringMatchIndex = function (attribute, inputFieldValue) {
    //return the index of the search string in attribute parameter passed to the function
    return attribute.toLowerCase().indexOf(inputFieldValue.toLowerCase());
  };

  /**
   * Utility function finds the substring to be highlighted and returns the highlighted substring
   * This function is used by handleSearchLogsEvent()
   * @param {int} matchIndex
   * @param {String} attribute
   * @param {String} inputFieldValue
   * @returns
   */
  let getHighligtedAttribute = function (matchIndex, attribute, inputFieldValue) {
    let stringToHighlight = matchIndex > -1 ? attribute.substr(matchIndex, inputFieldValue.trim().length) : '';
    return attribute.replace(stringToHighlight, `<span class="text-color-highlight bold-text">${stringToHighlight}</span>`);
  };
})();
