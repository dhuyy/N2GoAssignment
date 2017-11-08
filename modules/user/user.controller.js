(function() {
  'use strict';

  angular
    .module('user')
    .controller('UserController', ['UserService', UserController]);

  function UserController(UserService) {
    var vm = this;

    vm.users = [];

    function _onInit() {
      UserService.getUsers()
        .then(function(response) {
          vm.users = response;
        })
        .catch(function() {
          console.error('Unable to load users.')
        });
    }
    _onInit();
  }
})();
