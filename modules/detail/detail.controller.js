(function() {
  'use strict';

  angular
    .module('detail')
    .controller('DetailController', ['$state', '$stateParams', 'UserService', DetailController]);

  function DetailController($state, $stateParams, UserService) {
    var vm = this;

    vm.user = {};

    function _getUser() {
      vm.user = UserService.getUser($stateParams.id);

      if (!vm.user)
        $state.go('users');
    }

    function _onInit() {
      UserService.fetchUsers(function() {
        _getUser();
      });
    }
    _onInit();
  }
})();
