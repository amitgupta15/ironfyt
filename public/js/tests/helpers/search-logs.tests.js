(function () {
  'use strict';
  console.group('\x1b[34m%s\x1b[0m', 'search-log.js Tests');

  $test.it('should show perform search and show search results', function () {
    let workoutlogs = [{ _id: '12312341324', date: new Date(), notes: 'did something' }];
    let state = { pageTitle: 'Default Template' };
    let defaultTemplate = function (props) {
      return `<h1>${props.pageTitle}</h1>`;
    };
    let selector = document.querySelector('#selector');
    selector.innerHTML = `<div id="main-div"></div>${$ironfyt.searchBarTemplate('search-input', 'Search Logs...')}`;
    let searchInput = document.querySelector('#search-input');
    let div = document.querySelector('#main-div');

    $ironfyt.searchWorkoutLogs(div, workoutlogs, searchInput, defaultTemplate, state);
    $test.assert(selector.innerHTML.includes('<div id="main-div"><h1>Default Template</h1></div>'));

    searchInput.value = 'did';
    $ironfyt.searchWorkoutLogs(div, workoutlogs, searchInput, defaultTemplate, state);
    $test.assert(selector.innerHTML.includes('<div id="main-div"><div id="autocomplete-search-result"><div><div class="margin-bottom-5px text-color-secondary">Found 1 Logs</div>'));
    $test.assert(selector.innerHTML.includes('<div><span class="text-color-highlight bold-text">did</span> something</div>'));
  });
  console.groupEnd();
})();
