(function () {
  ('use strict');

  // Create a global variable and expose it the world.
  var $ironfyt = {};
  self.$ironfyt = $ironfyt;

  let fetch = $hl.fetch;
  let serverUrl = 'http://localhost:3000';

  $ironfyt.AUTH_TOKEN = 'ironfyt-auth-token';
  $ironfyt.AUTH_USER = 'ironfyt-auth-user';

  $ironfyt.login = function (loginInfo, callback) {
    fetch.post(`${serverUrl}/login`, loginInfo, function (error, response) {
      callback(error, response);
    });
  };

  /**
   * This methods builds the HTML for a page. It encapsulates the common page elements such as header, footer and takes a pageTemplate parameter that
   * holds the main content for the page
   *
   * @param {object} props - props to be passed to a template
   * @param {function} template - a template method that returns an html template
   */
  $ironfyt.pageTemplate = function (props, template) {
    props = props !== undefined ? props : {};
    if (props.error) {
      return errorTemplate(props.error);
    } else {
      return `
        ${topBarTemplate(props)}
        <div class="main">
        ${template(props)}
        </div>
        `;
    }
  };

  $ironfyt.navigateToUrl = function (page) {
    window.location.href = page;
  };

  //Topbar template
  let topBarTemplate = function (props) {
    return `<div>Top Bar</div>`;
  };

  // Common error template which can be shared across components to render error messages
  let errorTemplate = function (error) {
    return `<p class="error-div">${error.message}</p>`;
  };
})();
