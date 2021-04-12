(function () {
  ('use strict');

  // Create a global variable and expose it the world.
  var $ironfyt = {};
  self.$ironfyt = $ironfyt;

  let fetch = $hl.fetch;

  let serverUrl = 'http://localhost:3000';

  $ironfyt.fetchUsers = function (callback) {
    fetch.get(`${serverUrl}/api/users`, function (response) {
      console.log(response);
    });
    console.log($hl.fetch);
  };
})();
