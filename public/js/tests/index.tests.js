(function () {
  'use strict';
  console.group('\x1b[34m%s\x1b[0m', 'index.js Tests');

  let component = $ironfyt.landingPageComponent;
  let page = $ironfyt.landingPage;

  $test.it('should create the landing page component', function () {
    $test.assert(component.selector === '[data-app=landing]');
    $test.assert(Object.keys(component.state).length === 3);
    $test.assert('user' in component.state);
    $test.assert('error' in component.state);
    $test.assert('groupwods' in component.state);
  });

  $test.it('should redirect to the login page if no token found or expired token', function () {
    $ironfyt.getCredentials = function () {
      return {};
    };
    let _page;
    $ironfyt.navigateToUrl = function (page) {
      _page = page;
    };

    page();
    $test.assert(_page === 'login.html');
  });

  $test.it('should fetch group wods when page loads', function () {
    $ironfyt.getCredentials = function () {
      return { token: 1234, user: { _id: 1, email: 'amitgupta15@gmail.com' } };
    };
    $ironfyt.getGroupWod = function (params, callback) {
      callback(false, [
        { name: 'group 1', workout: 'workout 1' },
        { name: 'group 2', workout: 'workout 2' },
      ]);
    };
    page();
    let state = component.getState();
    $test.assert(state.user.email === 'amitgupta15@gmail.com');
    $test.assert(state.groupwods.length === 2);
  });
  console.groupEnd();
})();
