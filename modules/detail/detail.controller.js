(function() {
  'use strict';

  angular
    .module('detail')
    .controller('DetailController', ['$state', '$stateParams', '$uibModal', 'UserService', DetailController]);

  function DetailController($state, $stateParams, $uibModal, UserService) {
    var vm = this;

    vm.user = {};

    vm.editUser = editUser;
    vm.cancelEdit = cancelEdit;

    function editUser() {
      UserService.editUser(vm.user);

      $state.go('users');
    }

    function cancelEdit(isDirty) {
      if (isDirty) {
        $uibModal.open({
          animation: false,
          ariaDescribedBy: 'modal-body',
          templateUrl: 'confirmCancelModal',
          controller: ['$uibModalInstance', function($uibModalInstance) {
            var $ctrl = this;

            $ctrl.confirm = function () {
              $uibModalInstance.dismiss('cancel');

              $state.go('users');
            };

            $ctrl.cancel = function () {
              $uibModalInstance.dismiss('cancel');
            };
          }],
          controllerAs: '$ctrl',
          size: 'sm'
        });
      } else {
        $state.go('users');
      }
    }

    function _getUser() {
      vm.user = angular.copy(UserService.getUser($stateParams.id));

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
