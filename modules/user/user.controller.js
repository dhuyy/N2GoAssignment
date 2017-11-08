(function() {
  'use strict';

  angular
    .module('user')
    .controller('UserController', ['ngTableParams', 'UserService', UserController]);

  function UserController(ngTableParams, UserService) {
    var vm = this;

    vm.users = [];

    function _onInit() {
      UserService.getUsers()
        .then(function(response) {
          vm.users = response;

          _runUserTable();
        })
        .catch(function() {
          console.error('Unable to load users.')
        });
    }
    _onInit();

    /*
    * ngTable
     */
    function _runUserTable() {
      vm.tableData = new ngTableParams({
        page: 1,
        count: 10
      }, {
        counts: [],
        total: vm.users.length,
        getData: function ($defer, params) {
          var offset = (params.page() - 1) * params.count();
          var limit = params.page() * params.count();

          $defer.resolve(vm.users.slice(offset, limit));
        }
      });
    }
  }
})();
