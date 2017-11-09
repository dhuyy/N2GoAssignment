(function() {
  'use strict';

  angular
    .module('user')
    .controller('UserController', ['$scope', '$uibModal', '$state', 'ngTableParams', 'ngTableEventsChannel', 'UserService', UserController]);

  function UserController($scope, $uibModal, $state, ngTableParams, ngTableEventsChannel, UserService) {
    var vm = this;

    vm.users = [];

    ngTableEventsChannel.onPagesChanged(function() {
      vm.selectedRowsLength = 0;
    });

    $scope.$on('increaseSelectedRowsLength', function() {
      vm.selectedRowsLength++;
    });

    $scope.$on('decreaseSelectedRowsLength', function() {
      vm.selectedRowsLength--;
    });

    $scope.$on('showUser', function(event, args) {
      $uibModal.open({
        animation: false,
        ariaDescribedBy: 'modal-body',
        templateUrl: 'showUserModal',
        controller: ['$uibModalInstance', function($uibModalInstance) {
          var $ctrl = this;

          $ctrl.firstName = args.firstName;
          $ctrl.lastName = args.lastName;
          $ctrl.dateOfBirth = args.dateOfBirth;

          $ctrl.close = function () {
            $uibModalInstance.dismiss('cancel');
          };
        }],
        controllerAs: '$ctrl',
        size: 'md'
      });
    });

    $scope.$on('editUser', function(event, args) {
      $state.go('detail', { id: args });
    });

    $scope.$on('deleteUser', function(event, args) {
      vm.users = vm.users.filter(function(element) {
        return element.id != args;
      });

      _reloadUserTable();
    });

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
