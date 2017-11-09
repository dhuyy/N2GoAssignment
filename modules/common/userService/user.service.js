(function() {
  'use strict';

  angular
    .module('common')
    .factory('UserService', ['$http', 'SERVER', UserService]);

  function UserService($http, SERVER) {
    var _users = [];

    var userService = {
      fetchUsers: fetchUsers,
      getUsers: getUsers,
      getUser: getUser,
      deleteUser: deleteUser
    };
    return userService;

    function getUsers() {
      return _users;
    }

    function getUser(userId) {
      return _users.filter(function(user) {
        return user.id == userId;
      })[0];
    }

    function deleteUser(userId) {
      _users = _users.filter(function(user) {
        return user.id != userId;
      });
    }

    function fetchUsers(callback) {
      if (_users.length !== 0) {
        if (callback)
          callback();

        return;
      }

      $http.get(SERVER.ENDPOINTS.GET_USERS)
        .then(function(response) {
          _users = response.data;

          if (callback)
            callback();
        })
        .catch(function() {
          console.error('Unable to load users.')
        });
    }
  }
})();
