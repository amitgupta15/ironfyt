(function () {
  'use strict';

  console.group('\x1b[34m%s\x1b[0m', 'group.js Tests');

  let component = $ironfyt.groupComponent;
  let page = $ironfyt.groupPage;

  $test.it('should create a group component', function () {
    $test.assert(component.selector === '[data-app=group]');
    $test.assert(Object.keys(component.state).length === 4);
    $test.assert('user' in component.state);
    $test.assert('error' in component.state);
    $test.assert('group' in component.state);
    $test.assert('date' in component.state);
  });

  $test.it('should not allow unauthorized users to view this page', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback('You are not authorized');
    };
    page();
    let state = component.getState();
    $test.assert(state.error === 'You are not authorized');
  });

  $test.it('should only allow user to view the groups he belongs to', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { _id: 1, groups: ['888888888888888888888888', '999999999999999999999999'] } });
    };
    $hl.getParams = function () {
      return {
        group_id: '888888888888888888889999',
        date: new Date(),
      };
    };

    page();
    let state = component.getState();
    $test.assert(state.error === 'You are not allowed to view this group page');
  });

  $test.it('should fetch group and all the related logs for a given group and date', function () {
    $ironfyt.authenticateUser = function (callback) {
      callback(false, { user: { groups: ['123456123456123456123456'] } });
    };
    $ironfyt.getGroup = function (params, callback) {
      callback(false, [{ name: 'group 1' }]);
    };
    $hl.getParams = function () {
      return {
        group_id: '123456123456123456123456',
        date: '2021-01-05T08:00:00.000Z',
      };
    };

    page();
    let state = component.getState();
    $test.assert(state.group.name === 'group 1');
  });

  $test.it('should load the data for a given day when next button is clicked', function () {
    let selector = document.querySelector('#selector');
    component.setState({ group: { _id: '123456123456123456123456' }, date: '2021-01-05T08:00:00.000Z' });
    let state = component.getState();
    selector.innerHTML = component.template(state);

    $test.dispatchHTMLEvent('click', '#group-next-day-btn');
    state = component.getState();
    $test.assert(state.date === '2021-01-06T08:00:00.000Z');
  });

  $test.it('should load the data for a given day when prev button is clicked', function () {
    let selector = document.querySelector('#selector');
    component.setState({ group: { _id: '123456123456123456123456' }, date: '2021-01-05T08:00:00.000Z' });
    let state = component.getState();
    selector.innerHTML = component.template(state);

    $test.dispatchHTMLEvent('click', '#group-prev-day-btn');
    state = component.getState();
    $test.assert(state.date === '2021-01-04T08:00:00.000Z');
  });
  console.groupEnd();
})();
