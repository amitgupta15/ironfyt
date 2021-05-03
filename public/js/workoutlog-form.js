(function () {
  'use strict';

  let workoutlogFormTemplate = function (props) {
    let workoutlog = props.workoutlog ? props.workoutlog : {};
    let wologdate = workoutlog && workoutlog.date ? $hl.formatDateForInputField(workoutlog.date) : '';
    let validationError = props.validationError ? props.validationError : {};
    return `
    <div class="container">
      <h1>Workout Log</h1>
      <form id="workout-log-form">
        <div>
          <label for="wolog-date">Date <span>*</span></label>
          <input type="date" name="wolog-date" id="wolog-date" value="${wologdate}" placeholder="Date">
          ${validationError.date ? `<div id="error-wolog-date">${validationError.date}</div>` : ``}
        </div>
        <div>
          <label for="wolog-duration">Duration</label>
          <input type="text" name="wolog-duration" id="wolog-duration" value="${workoutlog.duration ? workoutlog.duration : ''}" placeholder="30 min.">
        </div>
        <div>
          <label for="wolog-load">Load</label>
          <input type="text" name="wolog-load" id="wolog-load" value="${workoutlog.load ? workoutlog.load : ''}" placeholder="135 lbs.">
        </div>
        <div>
          <label for="wolog-rounds">Rounds</label>
          <input type="text" name="wolog-rounds" id="wolog-rounds" value="${workoutlog.rounds ? workoutlog.rounds : ''}" placeholder="5">
        </div>
        <div>
          <label for="wolog-notes">Notes</label>
          <textarea row=3 col=12 name="wolog-notes" id="wolog-notes" placeholder="Notes">${workoutlog.notes ? workoutlog.notes : ''}</textarea>
          ${validationError.catchAll ? `<div id="error-catch-all">${validationError.catchAll}` : ''}
        </div>
        <div>
          <button type="submit" id="submit-wolog">Save</button>
          <button type="button" id="cancel-submit-wolog" onclick="window.history.back()">Cancel</button>
        </div>
      </form>
    </div>
    `;
  };

  let component = ($ironfyt.workoutlogFormComponent = Component('[data-app=workoutlog-form]', {
    state: {
      error: '',
      validationError: {},
      workoutlog: {},
      user: {},
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, workoutlogFormTemplate);
    },
  }));

  let handleWorkoutLogFormSubmitEvent = function (event) {
    event.preventDefault();
    let elements = document.querySelector('#workout-log-form').elements;
    let state = component.getState();
    let workoutlog = state.workoutlog ? state.workoutlog : {};
    let date = $hl.getDateObjFromHTMLDateInput(elements['wolog-date'].value);
    workoutlog.date = date instanceof Date && !isNaN(date) ? date : '';
    workoutlog.duration = elements['wolog-duration'].value.trim();
    workoutlog.load = elements['wolog-load'].value.trim();
    workoutlog.rounds = elements['wolog-rounds'].value.trim();
    workoutlog.notes = elements['wolog-notes'].value.trim();
    workoutlog.user_id = workoutlog.user_id ? workoutlog.user_id : state.user._id;

    //Validate Form input
    let validationError = {};
    if (elements['wolog-date'].value === '') {
      validationError.date = 'Please enter a date for the log';
    }
    if (elements['wolog-duration'].value.trim() === '' && elements['wolog-load'].value.trim() === '' && elements['wolog-rounds'].value.trim() === '' && elements['wolog-notes'].value.trim() === '') {
      validationError.catchAll = 'Please enter a value in one of the fields or add notes.';
    }

    component.setState({ workoutlog, validationError });
    if (JSON.stringify(validationError) === '{}') {
      $ironfyt.saveWorkoutLog(workoutlog, function (error, response) {
        $ironfyt.navigateToUrl('workoutlog.html');
      });
      // console.log(workoutlog);
    }
  };
  $hl.eventListener('submit', 'workout-log-form', handleWorkoutLogFormSubmitEvent);

  ($ironfyt.workoutlogFormPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      let user = auth && auth.user ? auth.user : {};
      if (!error) {
        let params = $hl.getParams();
        let _id = params && params._id ? params._id : false;
        if (_id) {
          $ironfyt.getWorkoutLogs({ _id }, function (error, response) {
            if (!error) {
              let workoutlog = response.workoutlogs.length ? response.workoutlogs[0] : {};
              component.setState({ workoutlog, user });
            } else {
              component.setState({ error });
            }
          });
        } else {
          component.setState({ user });
        }
      } else {
        component.setState({ error });
      }
    });
  })();
})();
