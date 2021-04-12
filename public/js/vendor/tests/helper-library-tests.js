(function () {
  ('use strict');
  /**
   * TEST helper-library.js
   */
  console.group('\x1b[34m%s\x1b[0m', 'Testing helper-library.js');

  let test = Uitest();
  let hl = HelperLib();

  test.it('should sort an array of objects given a property and order', function () {
    var unsortedArray = [{ id: 5 }, { id: 7 }, { id: 9 }];
    var sortedArray = hl.sortArray(unsortedArray, 'id', 'desc');
    test.assert(sortedArray.length === unsortedArray.length);
    test.assert(sortedArray[0].id === 9);
    test.assert(sortedArray[2].id === 5);
  });

  test.it('should validate a date string', function () {
    // Valid Date
    var valid = hl.isValidDate('11/01/2020');
    test.assert(valid);

    // Invalid Date
    valid = hl.isValidDate('13/01/2020');
    test.assert(!valid);

    valid = hl.isValidDate('12/32/2020');
    test.assert(!valid);

    valid = hl.isValidDate('12/31/2020');
    test.assert(valid);
  });

  test.it('should format the date string to mm/dd/yyyy', function () {
    test.assert(hl.formatDateString('3/6/20') === '03/06/2020');
    test.assert(hl.formatDateString('3/6/7') === '03/06/2007');
    test.assert(hl.formatDateString('03/6/7') === '03/06/2007');
    test.assert(hl.formatDateString('03/06/7') === '03/06/2007');
    test.assert(hl.formatDateString('03/06/07') === '03/06/2007');
    test.assert(hl.formatDateString('03/06/2020') === '03/06/2020');
  });

  test.it('should match closest selector in the parent chain for a given element', function () {
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
    test.assert(matchedId === 'dt200702');

    //machedId should be 'false' for <div id="selector"> when matched with calendar regex
    matchedId = hl.matchClosestSelector(selector, calendarItemIdRegEx);
    test.assert(matchedId === false);

    //machedId should be 'selector' when we try the exact match
    matchedId = hl.matchClosestSelector(selector, 'selector');
    test.assert(matchedId === 'selector');

    //matchedId should be 'false' when we try to match with invalid id
    matchedId = hl.matchClosestSelector(nested2, 'dt200701');
    test.assert(matchedId === false);

    //matchedId should be 'dt200702' when we try to do an exact match but with a child selector
    matchedId = hl.matchClosestSelector(nested2, 'dt200702');
    test.assert(matchedId === 'dt200702');

    // matchedId should match appropriate id selector
    var allNestLevel2Elements = document.querySelectorAll('.nest-level-2');
    test.assert(allNestLevel2Elements.length === 2);
    matchedId = hl.matchClosestSelector(allNestLevel2Elements[0], calendarItemIdRegEx);
    test.assert(matchedId === 'dt200702');

    matchedId = hl.matchClosestSelector(allNestLevel2Elements[1], calendarItemIdRegEx);
    test.assert(matchedId === 'dt200703');
    selector.innerHTML = '';
  });

  test.it('hl.eventListener should add an event listener for a given id', function () {
    hl.eventListener('click', 'click-1', function (ev) {
      document.getElementById('click-1').innerHTML = '1';
    });
    var selector = document.getElementById('selector');
    selector.innerHTML = `<div id="click-1"></div>`;
    var click1 = document.getElementById('click-1');

    // Event Creation
    var ev = document.createEvent('HTMLEvents');
    ev.initEvent('click', true, true);
    click1.dispatchEvent(ev);
    // Assert
    test.assert(document.getElementById('click-1').innerHTML === '1');
    //Clean up
    selector.innerHTML = '';
  });

  test.it('hl.formatNumber() should format a number', function () {
    test.assert(hl.formatNumber('1234', 2) === '1,234');
    test.assert(hl.formatNumber('123456.4567', 2) === '123,456.46');
    test.assert(hl.formatNumber(123456.4567, 2) === '123,456.46');
  });

  test.it('hl.getDateObjFromHTMLDateInput() should return a Date object', function () {
    let dateString = '2020-12-15';
    let dateObj = hl.getDateObjFromHTMLDateInput(dateString);
    test.assert(dateObj.getFullYear() === 2020);
    test.assert(dateObj.getMonth() === 11);
    test.assert(dateObj.getDate() === 15);

    // Returns false when no value or invalid value provided
    test.assert(hl.getDateObjFromHTMLDateInput('') === false);
    test.assert(hl.getDateObjFromHTMLDateInput('amit') === false);
    test.assert(hl.getDateObjFromHTMLDateInput('2020-01-40') === false);
  });

  test.it('hl.formatDateForInputField() should return a string in yyyy-MM-dd format', function () {
    test.assert(hl.formatDateForInputField(new Date('12/15/2020')) === '2020-12-15');
  });
  console.groupEnd();
})();
