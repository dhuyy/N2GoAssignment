(function() {
  'use strict';

  angular
    .module('detail')
    .controller('DetailController', ['$state', '$stateParams', '$uibModal', 'UserService', DetailController]);

  function DetailController($state, $stateParams, $uibModal, UserService) {
    var vm = this;

    /**
     * This property keeps the current user.
     * @type {Object}
     */
    vm.user = {};

    vm.editUser = editUser;
    vm.cancelEdit = cancelEdit;

    /**
     * This function is responsible for editing a user and for redirecting to the users list page.
     */
    function editUser() {
      UserService.editUser(vm.user);

      $state.go('users');
    }

    /**
     * This function is responsible for showing a confirmation modal if any changes are made to the user and redirected
     * to the user list page if there have been no changes.
     * @param isDirty
     */
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

    /**
     * Function responsible for get the current user and for redirecting to the user list page if there is no user.
     * @private
     */
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
