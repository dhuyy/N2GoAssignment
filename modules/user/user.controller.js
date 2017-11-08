(function() {
  'use strict';

  angular
    .module('user')
    .controller('UserController', ['$uibModal', 'ngTableParams', 'UserService', UserController]);

  function UserController($uibModal, ngTableParams, UserService) {
    var vm = this;

    vm.users = [];

    vm.open = open;

    function open(user) {
      $uibModal.open({
        animation: false,
        ariaDescribedBy: 'modal-body',
        templateUrl: 'showUserModal',
        controller: ['$uibModalInstance', function($uibModalInstance) {
          var $ctrl = this;

          $ctrl.user = user;

          $ctrl.close = function () {
            $uibModalInstance.dismiss('cancel');
          };
        }],
        controllerAs: '$ctrl',
        size: 'md'
      });
    }

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
