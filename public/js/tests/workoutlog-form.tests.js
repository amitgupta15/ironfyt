(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'workoutlog-form.js Tests');

  let component = $ironfyt.workoutlogFormComponent;
  let page = $ironfyt.workoutlogFormPage;

  $test.it('should create a workoutlogformComponent', function () {
    $test.assert('error' in component.state);
    $test.assert('validationError' in component.state);
    $test.assert('user' in component.state);
    $test.assert('workoutlog' in component.state);
    $test.assert(component.selector === '[data-app=workoutlog-form]');
  });

  $test.it('should not allow unauthorized users to add a log', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback('error occurred');
    };
    page();
    let state = component.getState();
    $test.assert(state.error === 'error occurred');
  });

  $test.it('should only allow authorized users to add a log', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: 1 } });
    };
    page();
    let state = component.getState();
    $test.assert(state.error === '');
    $test.assert(state.user._id === 1);
  });

  $test.it('should handle invalid form data', function () {
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({});
    $test.dispatchHTMLEvent('submit', '#workout-log-form');
    let state = component.getState();
    $test.assert(state.validationError.date === 'Please enter a date for the log');
    $test.assert(state.validationError.catchAll === 'Please enter a value in one of the fields or add notes.');
  });

  $test.it('should handle valid form data', function () {
    let _workoutlog;
    $ironfyt.saveWorkoutLog = function (workoutlog, callback) {
      _workoutlog = workoutlog;
      callback();
    };

    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({});
    let form = document.querySelector('#workout-log-form');

    form.elements['wolog-date'].value = '2020-01-01';
    form.elements['wolog-notes'].value = 'Some notes';

    $test.dispatchHTMLEvent('submit', '#workout-log-form');
    let state = component.getState();
    $test.assert(JSON.stringify(state.validationError) === '{}');
    $test.assert($hl.formatDateForInputField(state.workoutlog.date) === '2020-01-01');
    $test.assert(state.workoutlog.notes === 'Some notes');
    $test.assert($hl.formatDateForInputField(_workoutlog.date) === '2020-01-01');
    $test.assert(_workoutlog.notes === 'Some notes');
  });

  $test.it('should show workout list dialog when select-workout-btn is clicked', function () {
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({});

    $test.assert(selector.innerHTML.includes('<div id="select-workout-modal" style="display:none;">'));
    $test.dispatchHTMLEvent('click', '#select-workout-btn');
    $test.assert(selector.innerHTML.includes('<div id="select-workout-modal" style="display: block;">'));
    $test.assert(selector.innerHTML.includes('<button type="button" id="select-workout-btn" disabled="">'));
    $test.assert(selector.innerHTML.includes('<div id="selected-workout-div" style="display:none">'));
    $test.assert(document.getElementById('wolog-workout-id').value === '');
  });

  $test.it('should close the workout list dialog when close button is clicked', function () {
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({});

    $test.assert(selector.innerHTML.includes('<div id="select-workout-modal" style="display:none;">'));
    $test.dispatchHTMLEvent('click', '#select-workout-btn');
    $test.assert(selector.innerHTML.includes('<div id="select-workout-modal" style="display: block;">'));
    $test.dispatchHTMLEvent('click', '#close-workout-list-modal');
    $test.assert(selector.innerHTML.includes('<div id="select-workout-modal" style="display: none;">'));
  });

  $test.it('should populate the workout and close the workout list model when a workout is selected', function () {
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({});

    $test.assert(selector.innerHTML.includes('<div id="select-workout-modal" style="display:none;">'));
    $test.dispatchHTMLEvent('click', '#select-workout-btn');
    $test.dispatchHTMLEvent('click', '#workout-6070eec7f20f85401bca47a1');

    $test.assert(selector.innerHTML.includes('<div id="select-workout-modal" style="display: none;">'));
    $test.assert(selector.innerHTML.includes('<button type="button" id="select-workout-btn" disabled="" style="display: none;">'));
    $test.assert(selector.innerHTML.includes('<div id="selected-workout-div" style="display: block;">'));
    $test.assert(selector.innerHTML.includes('<span id="selected-workout-span">Linda</span>'));
    $test.assert(selector.innerHTML.includes('<input type="hidden" id="wolog-workout-id" value="6070eec7f20f85401bca47a1">'));
  });

  console.groupEnd();
})();
