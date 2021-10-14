(function () {
  'use strict';

  /**
   * Main form template for the form
   * @param {Object} props
   * @returns form template
   */
  let movementprFormTemplate = function (props) {
    let showSpinner = props && props.showSpinner;
    let movementpr = props && props.movementpr ? props.movementpr : {};
    if (showSpinner) {
      return $ironfyt.displaySpinner();
    } else {
      return `
      <div class="container">
        <form id="movementpr-form">
          <div class="form-input-group margin-top-20px margin-bottom-10px">
            <input type="text" class="form-input" name="movement-name" maxlength="30" id="movement-name" placeholder="Movement" value="${movementpr.name ? movementpr.name : ''}" required autofocus>
            <label for="movement-name" class="form-label">Movement</label>
          </div>
          <div class="form-flex-group margin-bottom-5px">
            <div class="form-input-group">
              <input type="number" class="form-input wolog-movement-attr" name="movement-reps-0" id="wolog-movement-reps-0" value="" placeholder="Reps">    
              <label for="wolog-movement-reps-0" class="form-label rounds-label">Reps</label>
            </div>      
            <div class="form-input-group">  
              <input type="number" class="form-input wolog-movement-attr" name="wolog-movement-load-0" id="wolog-movement-load-0" value="" placeholder="Load">
              <label for="wolog-movement-load-0" class="form-label rounds-label">Load</label>
            </div>
            <div class="form-input-group">
              <label for="wolog-movement-unit-0" class="form-label hide-view">Unit</label>
              <select class="form-input" name="wolog-movement-unit-0" id="wolog-movement-unit-0">
                <option value=""></option>
                ${$ironfyt.units.map((unit) => `<option value="${unit}" ${unit === 'lbs' ? 'selected' : ''}>${unit}</option>`)}
              </select>
            </div>
            <!--button type="button" class="copy-btn" id="copy-movement-0"></button>
            <button type="button" class="remove-btn" id="delete-movement-0"></button-->
          </div>
          <div class="form-input-group">
              <input type="date" name="date-0" id="date-0" value="" placeholder="Date" class="form-input"/>
              <label for="date-0" class="form-label date-label">Date</label>
            </div>
            
        </form>
      </div>
      `;
    }
  };

  let component = ($ironfyt.movementprFormComponent = Component('[data-app=movementpr-form]', {
    state: {
      error: '',
      validationError: {},
      movementpr: {},
      user: {},
      movements: [],
      pageTitle: 'New Personal Record',
      showSpinner: false,
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, movementprFormTemplate);
    },
  }));

  ($ironfyt.movementprFormPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (error) {
        component.setState({ error, showSpinner: false });
        return;
      }
      let user = auth && auth.user ? auth.user : {};
      component.setState({ user, showSpinner: true });

      $ironfyt.getMovements({}, function (error, response) {
        let movements = response ? response.movements : [];
        component.setState({ movements, showSpinner: false });
      });
    });
  })();
})();
