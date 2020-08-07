(function (global) {
  var helper = {};

  /**
   * getParams() helper function
   * Inspired by https://css-tricks.com/snippets/javascript/get-url-variables/
   */
  helper.getParams = function () {
    var query = window.location.search.substring(1);
    var params = {};
    if (query) {
      var pairs = query.split('&');
      pairs.forEach(function (pair) {
        var param = pair.split('=');
        if (param[1]) params[param[0]] = param[1];
      });
    }
    return params;
  };

  /**
   * fetch() helper function - encapsulates XMLHttpRequest() calls
   */
  helper.fetch = {
    get: function (url, callback) {
      var requestListener = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200) {
            var response = JSON.parse(httpRequest.response);
            callback(response);
          } else {
            alert('There was a problem with the request');
          }
        }
      };

      var httpRequest = new XMLHttpRequest();
      httpRequest.addEventListener('load', requestListener);
      httpRequest.open('GET', url);
      httpRequest.send();
    },
    post: function (url, data, callback) {
      var httpRequest = new XMLHttpRequest();
      httpRequest.addEventListener('load', function () {
        if (httpRequest.status === 200) {
          var response = JSON.parse(httpRequest.response);
          callback(response);
        }
      });
      httpRequest.open('POST', url);
      httpRequest.send(JSON.stringify(data));
    },
    put: function (url, data, callback) {
      var httpRequest = new XMLHttpRequest();
      httpRequest.addEventListener('load', function () {
        if (httpRequest.status === 200) {
          var response = JSON.parse(httpRequest.response);
          callback(response);
        }
      });
      httpRequest.open('PUT', url);
      httpRequest.send(JSON.stringify(data));
    },
  };

  /**
   * Replace new line \n with <br/> tag in a string for proper HTML rendering
   * @param string text containing new line character
   * */
  helper.replaceNewLineWithBR = function (string) {
    return string.replace(/\n/g, '<br/>');
  };

  /**
   * Handlers adding event generic event listeners. target matching is used here to work with dynamically generated html
   * @param eventType Event Type eg: 'click', 'submit', 'reset', etc.
   * @param targetId Target ID
   * @param callback callback function takes event parameter
   * */
  helper.eventListener = function (eventType, targetId, callback) {
    document.addEventListener(eventType, function (event) {
      if (event.target.id === targetId) {
        callback(event);
      }
    });
  };

  /**
   * Client side router
   * This router looks for data-app HTML attribute and routes based on matching attribute.
   * @param paths Object. "paths" object takes the value of data-app attribute as the key and the function to execute for the page as the value of the object
   */
  helper.router = function (paths) {
    var app = document.querySelector('[data-app]');
    if (app) {
      // Determine the view to show
      var page = app.getAttribute('data-app');
      for (var key in paths) {
        if (paths.hasOwnProperty(key)) {
          if (page === key) {
            paths[key]();
          }
        }
      }
    }
  };

  /**
   * Concatenate Object values as a string (useful for search)
   * @param obj Object whose values need to be concatenated
   *
   */
  helper.concatObjValuesAsString = function (obj) {
    var objString = '';
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && key !== 'id' && obj[key] !== null) {
        objString += obj[key].toString().toLowerCase().trim() + ' ';
      }
    }
    return objString;
  };

  /**
   * @param arr - Array to be sorted
   * @param property - property to sort the array for
   * @param order - {asc, desc}
   */
  helper.sortArray = function (arr, property, order) {
    return arr.sort(function (a, b) {
      if (order.toLowerCase() === 'desc') {
        return b[property] - a[property];
      } else {
        return a[property] - b[property];
      }
    });
  };

  /**
   * @param dateString - Date string
   */
  helper.isValidDate = function (dateString) {
    var dateRegex = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/gi;
    return dateRegex.test(dateString);
  };

  /**
   * @param string - Date string to be formatted
   */
  helper.formatDateString = function (string) {
    var splitString = string.split('/');
    if (splitString.length === 3) {
      if (splitString[0].length === 1) splitString[0] = '0' + splitString[0];
      if (splitString[1].length === 1) splitString[1] = '0' + splitString[1];
      if (splitString[2].length === 2) splitString[2] = '20' + splitString[2];
      if (splitString[2].length === 1) splitString[2] = '200' + splitString[2];

      string = splitString.join('/');
      return string;
    }
    return false;
  };

  /**
   *
   * @param {string} element - target element
   * @param {string} pattern - either a class, id, data attribute or a regular expression
   */
  helper.matchClosestSelector = function (element, pattern) {
    if (element.id.match(pattern)) {
      return element.id;
    } else {
      let parentElement = element.parentElement;
      while (parentElement !== null) {
        if (parentElement.id.match(pattern)) {
          return parentElement.id;
        }
        parentElement = parentElement.parentElement;
      }
      return false;
    }
  };
  // Exporting the global object
  global.hl = helper;
})(window);
