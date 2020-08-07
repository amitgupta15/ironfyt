(function () {
  ('use strict');
  /**
   * TEST helper-library.js
   */
  console.group('\x1b[34m%s\x1b[0m', 'Testing helper-library.js');

  uitest.it('should sort an array of objects given a property and order', function () {
    var unsortedArray = [{ id: 5 }, { id: 7 }, { id: 9 }];
    var sortedArray = hl.sortArray(unsortedArray, 'id', 'desc');
    uitest.assert(sortedArray.length === unsortedArray.length);
    uitest.assert(sortedArray[0].id === 9);
    uitest.assert(sortedArray[2].id === 5);
  });

  uitest.it('should validate a date string', function () {
    // Valid Date
    var valid = hl.isValidDate('11/01/2020');
    uitest.assert(valid);

    // Invalid Date
    valid = hl.isValidDate('13/01/2020');
    uitest.assert(!valid);

    valid = hl.isValidDate('12/32/2020');
    uitest.assert(!valid);

    valid = hl.isValidDate('12/31/2020');
    uitest.assert(valid);
  });

  uitest.it('should format the date string to mm/dd/yyyy', function () {
    uitest.assert(hl.formatDateString('3/6/20') === '03/06/2020');
    uitest.assert(hl.formatDateString('3/6/7') === '03/06/2007');
    uitest.assert(hl.formatDateString('03/6/7') === '03/06/2007');
    uitest.assert(hl.formatDateString('03/06/7') === '03/06/2007');
    uitest.assert(hl.formatDateString('03/06/07') === '03/06/2007');
    uitest.assert(hl.formatDateString('03/06/2020') === '03/06/2020');
  });

  uitest.it('should match closest selector in the parent chain for a given element', function () {
    var selector = document.getElementById('selector');
    selector.innerHTML = `
      <div id='dt200702'>
        <div class='nest-level-1'>
          <div class='nest-level-2'>1
          </div>
        </div>
      </div>
      <div id='dt200703'>
        <div class='nest-level-1'>
          <div class='nest-level-2'>2
          </div>
        </div>
      </div>
    `;
    var nested2 = document.querySelector('.nest-level-2');
    let calendarItemIdRegEx = new RegExp(/dt\d{6}/); //Example: 'dt200701';

    var matchedId = hl.matchClosestSelector(nested2, calendarItemIdRegEx);
    uitest.assert(matchedId === 'dt200702');

    //machedId should be 'false' for <div id="selector"> when matched with calendar regex
    matchedId = hl.matchClosestSelector(selector, calendarItemIdRegEx);
    uitest.assert(matchedId === false);

    //machedId should be 'selector' when we try the exact match
    matchedId = hl.matchClosestSelector(selector, 'selector');
    uitest.assert(matchedId === 'selector');

    //matchedId should be 'false' when we try to match with invalid id
    matchedId = hl.matchClosestSelector(nested2, 'dt200701');
    uitest.assert(matchedId === false);

    //matchedId should be 'dt200702' when we try to do an exact match but with a child selector
    matchedId = hl.matchClosestSelector(nested2, 'dt200702');
    uitest.assert(matchedId === 'dt200702');

    // matchedId should match appropriate id selector
    var allNestLevel2Elements = document.querySelectorAll('.nest-level-2');
    uitest.assert(allNestLevel2Elements.length === 2);
    matchedId = hl.matchClosestSelector(allNestLevel2Elements[0], calendarItemIdRegEx);
    uitest.assert(matchedId === 'dt200702');

    matchedId = hl.matchClosestSelector(allNestLevel2Elements[1], calendarItemIdRegEx);
    uitest.assert(matchedId === 'dt200703');
    // selector.innerHTML = '';
  });
  console.groupEnd();
})();
