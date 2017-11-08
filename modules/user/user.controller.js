(function() {
  'use strict';

  angular
    .module('user')
    .controller('UserController', ['$uibModal', '$state', 'ngTableParams', 'UserService', UserController]);

  function UserController($uibModal, $state, ngTableParams, UserService) {
    var vm = this;

    vm.users = [];

    vm.openModal = openModal;
    vm.editUser = editUser;
    vm.deleteUser = deleteUser;

    function openModal(user) {
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

    function editUser(userId) {
      $state.go('detail', { id: userId });
    }

    function deleteUser(userId) {
      vm.users = vm.users.filter(function(element) {
        return element.id !== userId;
      });

      _reloadUserTable();
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
    function _reloadUserTable() {
      vm.tableData.reload();
    }

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
          var chunk = vm.users.slice(offset, limit);

          $defer.resolve(chunk);
          params.total(vm.users.length);

          if (!chunk.length && params.total() > 0)
            params.page(params.page() - 1);
        }
      });
    }
  }
})();
