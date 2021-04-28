(function (global) {
  var HelperLib = function () {
    return new HelperLib.init();
  };

  HelperLib.prototype = {
    /**
     * getParams() helper function
     * Inspired by https://css-tricks.com/snippets/javascript/get-url-variables/
     */
    getParams: function () {
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
    },

    /**
     * @param arr - Array to be sorted
     * @param property - property to sort the array for
     * @param order - {asc, desc}
     */
    sortArray: function (arr, property, order) {
      return arr.sort(function (a, b) {
        if (order.toLowerCase() === 'desc') {
          return b[property] - a[property];
        } else {
          return a[property] - b[property];
        }
      });
    },

    /**
     * fetch() helper function - encapsulates XMLHttpRequest() calls
     */
    fetch: {
      get: function (url, options, callback) {
        var requestListener = function () {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            try {
              let response = JSON.parse(httpRequest.response);
              if (httpRequest.status >= 400) {
                callback(response);
              } else {
                callback(false, response);
              }
            } catch (error) {
              callback({ message: error });
            }
          }
        };

        var httpRequest = new XMLHttpRequest();
        httpRequest.addEventListener('load', requestListener);
        httpRequest.addEventListener('error', function (error) {
          callback({ message: 'Error Connecting to the Server', error: error });
        });
        httpRequest.open('GET', url);
        options = options.toString() !== '{}' ? options : {};
        if (options.headers) {
          let headers = options.headers;
          if (typeof headers === 'object') {
            for (var key in headers) {
              httpRequest.setRequestHeader(key, headers[key]);
            }
          }
        }
        httpRequest.send();
      },
      delete: function (url, callback) {
        var requestListener = function () {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            try {
              let response = JSON.parse(httpRequest.response);
              if (httpRequest.status >= 400) {
                callback(response);
              } else {
                callback(false, response);
              }
            } catch (error) {
              callback({ message: error });
            }
          }
        };

        var httpRequest = new XMLHttpRequest();
        httpRequest.addEventListener('load', requestListener);
        httpRequest.addEventListener('error', function (error) {
          callback({ message: 'Error Connecting to the Server', error: error });
        });
        httpRequest.open('DELETE', url);
        httpRequest.send();
      },
      post: function (url, data, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.addEventListener('load', function () {
          let response = {};
          try {
            response = JSON.parse(httpRequest.response);
          } catch (error) {
            callback(error);
          }
          if (httpRequest.status >= 400) {
            callback(response);
          } else {
            callback(false, response);
          }
        });
        httpRequest.open('POST', url);
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.send(JSON.stringify(data));
      },
      put: function (url, data, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.addEventListener('load', function () {
          var response = JSON.parse(httpRequest.response);
          if (httpRequest.status >= 400) {
            callback(response);
          } else {
            callback(false, response);
          }
        });
        httpRequest.open('PUT', url);
        httpRequest.send(JSON.stringify(data));
      },
    },
    /**
     * Replace new line \n with <br/> tag in a string for proper HTML rendering
     * @param string text containing new line character
     * */
    replaceNewLineWithBR: function (string) {
      return string.replace(/\n/g, '<br/>');
    },
    /**
     * Handlers adding event generic event listeners. target matching is used here to work with dynamically generated html
     * @param eventType Event Type eg: 'click', 'submit', 'reset', etc.
     * @param targetId Target ID
     * @param callback callback function takes event parameter
     * */
    eventListener: function (eventType, target, callback) {
      document.addEventListener(eventType, function (event) {
        if (event.target.id === target) {
          callback(event);
        }
      });
    },
    /**
     * Client side router
     * This router looks for data-app HTML attribute and routes based on matching attribute.
     * @param paths Object. "paths" object takes the value of data-app attribute as the key and the function to execute for the page as the value of the object
     */
    router: function (paths) {
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
    },
    /**
     * Concatenate Object values as a string (useful for search)
     * @param obj Object whose values need to be concatenated
     *
     */
    concatObjValuesAsString: function (obj) {
      var objString = '';
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && key !== 'id' && obj[key] !== null) {
          objString += obj[key].toString().toLowerCase().trim() + ' ';
        }
      }
      return objString;
    },

    /**
     * @param dateString - Date string - Format: mm/dd/yyyy
     */
    isValidDate: function (dateString) {
      var dateRegex = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/gi;
      return dateRegex.test(dateString);
    },

    /**
     * @param string - Date string to be formatted
     */
    formatDateString: function (string) {
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
    },
    /**
     *
     * @param {string} date - String date in 'yyyy-MM-dd' format coming in from
     * <input type="date"> field. This needs to be converted into a date object
     */
    getDateObjFromHTMLDateInput: function (input) {
      let dateParts = input.split('-');
      let date = new Date(`${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`);
      if (isNaN(date.valueOf())) {
        return false;
      }
      date.setHours(0, 0, 0, 0);
      return date;
    },
    /**
     * Formats a date object for the value attribute in input field of type "date"
     * @param {Date} date - Date object
     * <input type="date">
     */
    formatDateForInputField: function (date) {
      date = new Date(date);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }
      let day = date.getDate();
      if (day < 10) {
        day = '0' + day;
      }
      return [year, month, day].join('-');
    },
    /**
     *
     * @param {string} element - target element
     * @param {string} pattern - either a class, id, data attribute or a regular expression
     */
    matchClosestSelector: function (element, pattern) {
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
    },
    formatNumber: function (number, precision, locale = 'en-US') {
      return new Intl.NumberFormat(locale).format(new Number(number).toFixed(precision));
    },
    downloadData: function (arr) {
      let data = convertToCSVFormat(arr);
      downloadCSV(data);
    },
    /**
     * Creates a url query string of type "_id=123456&user_id=789&"
     * @param {object} query
     * @returns
     */
    createQueryString: function (query) {
      let queryString = '';
      if (query && Object.keys(query).length > 0) {
        Object.keys(query).forEach((key) => {
          queryString += `${key}=${query[key]}&`;
        });
      }
      return queryString;
    },
  };

  /** Methods used by downloadData */
  /**
   * Converts the array of objects to csv format
   * @param {array} arr
   */
  let convertToCSVFormat = function (arr) {
    if (arr === null || !arr.length) return null;

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = Object.keys(arr[0]);
    let result = '';

    result += keys.join(columnDelimiter);
    result += lineDelimiter;
    arr.forEach((item) => {
      let insertColumnDelimiter = false;
      keys.forEach((key) => {
        result += insertColumnDelimiter ? columnDelimiter : '';
        result += `"${item[key]}"`;
        insertColumnDelimiter = true;
      });
      result += lineDelimiter;
    });
    return result;
  };

  let downloadCSV = function (csvdata) {
    const fileName = 'export.csv';
    const blob = new Blob([csvdata], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fileName); //IE 10+
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style = 'visibility:hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  HelperLib.init = function () {
    var self = this;
  };

  HelperLib.init.prototype = HelperLib.prototype;

  // Exporting the global object
  global.HelperLib = HelperLib;
  global.$hl = HelperLib();
})(window);
