(function () {
  'use strict';

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
  }));

  ($ironfyt.movementprFormPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (error) {
        component.setState({ error, showSpinner: false });
        return;
      }
      let user = auth && auth.user ? auth.user : {};
      component.setState({ user, showSpinner: true });
    });
  })();
})();
