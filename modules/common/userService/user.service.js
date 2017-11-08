(function() {
  'use strict';

  angular
    .module('common')
    .factory('UserService', ['$http', '$q', 'SERVER', UserService]);

  function UserService($http, $q, SERVER) {
    var _users = [];
    var deferred = $q.defer();

    var userService = {
      getUsers: getUsers,
      getUser: getUser
    };
    return userService;

    function getUsers() {
      if (_users.length !== 0) {
        deferred.resolve(_users);

        return deferred.promise;
      }

      return _fetchUsers();
    }

    function getUser(id) {

    }

    function _fetchUsers() {
      return $http.get(SERVER.ENDPOINTS.GET_USERS)
        .then(function(response) {
          _users = response.data;

          return _users;
        })
        .catch(function(error) {
          console.error(error)
        });
    }
  }
})();
