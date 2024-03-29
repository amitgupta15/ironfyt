(function () {
  'use strict';
  console.group('\x1b[34m%s\x1b[0m', 'login.js Tests');

  let component = $ironfyt.loginComponent;

  $test.it('should create login component', function () {
    $test.assert(component.selector === '[data-app=login]');
  });

  $test.it('should validate login credentials', function () {
    $ironfyt.login = function (loginInfo, callback) {
      callback(false, { token: 'afaketoken', user: { fname: 'amit' } });
    };
    let navigateToUrlCalled = false,
      _urlname = '';
    $ironfyt.navigateToUrl = function (urlname) {
      navigateToUrlCalled = true;
      _urlname = urlname;
    };

    let state = component.getState();
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template();

    //dispatch submit event on an empty form
    $test.dispatchHTMLEvent('submit', '#login-form');

    $test.assert(selector.innerHTML.includes('Please enter a valid email address and password'));

    let form = document.querySelector('#login-form');
    form.elements['email'].value = 'amitgupta15@gmail.com';
    form.elements['password'].value = 'passw';

    //dispatch submit event
    $test.dispatchHTMLEvent('submit', '#login-form');
    $test.assert(selector.innerHTML.includes('<div id="error-info"></div>'));
    $test.assert(navigateToUrlCalled === true);
    $test.assert(_urlname === '/');
  });

  $test.it('should check if user is already logged in', function () {
    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template({ token: 'afaketoken', user: { fname: 'Amit', lname: 'Gupta' } });

    $test.assert(selector.innerHTML.includes('You are already logged in Amit Gupta'));
  });

  $test.it('should convert the username/email id to lower case', function () {
    let _loginInfo;
    $ironfyt.login = function (loginInfo, callback) {
      _loginInfo = loginInfo;
      callback(false);
    };

    let selector = document.querySelector('#selector');
    selector.innerHTML = component.template();
    let form = document.querySelector('#login-form');
    form.elements['email'].value = 'AmitGupta15@gmail.com';
    form.elements['password'].value = 'apassword';

    $test.dispatchHTMLEvent('submit', '#login-form');
    $test.assert(_loginInfo.email === 'amitgupta15@gmail.com');
  });
  console.groupEnd();
})();
