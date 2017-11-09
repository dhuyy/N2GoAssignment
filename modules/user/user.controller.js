(function() {
  'use strict';

  angular
    .module('user')
    .controller('UserController', ['$scope', '$uibModal', '$state', 'ngTableParams', 'ngTableEventsChannel', 'UserService', UserController]);

  function UserController($scope, $uibModal, $state, ngTableParams, ngTableEventsChannel, UserService) {
    var vm = this;

    vm.selectedRowsLength = 0;

    vm.deleteMultipleRows = deleteMultipleRows;
    vm.generateCsv = generateCsv;
    vm.linkCsv = linkCsv;

    function deleteMultipleRows() {
      $scope.$broadcast('deleteSelectedRows');
    }

    function generateCsv() {
      vm.csv.generate();
    }

    function linkCsv() {
      if (vm.selectedRowsLength == 0)
        return '';

      return vm.csv.link();
    }

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

          $ctrl.user = {
            firstName: args.firstName,
            lastName: args.lastName,
            dateOfBirth: args.dateOfBirth
          };

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
      UserService.deleteUser(args);

      _reloadUserTable();
    });

    function _fetchUsers() {
      UserService.fetchUsers(function() {
        _runUserTable();
      });
    }

    function _registerOnPagesChangedEvent() {
      ngTableEventsChannel.onPagesChanged(function() {
        vm.selectedRowsLength = 0;
      });
    }

    function _reloadUserTable() {
      vm.tableData.reload();
    }

    function _runUserTable() {
      vm.tableData = new ngTableParams({
        page: 1,
        count: 10
      }, {
        counts: [],
        total: UserService.getUsers().length,
        getData: function ($defer, params) {
          var users = UserService.getUsers();

          var offset = (params.page() - 1) * params.count();
          var limit = params.page() * params.count();
          var chunk = users.slice(offset, limit);

          $defer.resolve(chunk);
          params.total(users.length);

          if (!chunk.length && params.total() > 0)
            params.page(params.page() - 1);
        }
      });
    }

    function _onInit() {
      _fetchUsers();
      _registerOnPagesChangedEvent();
    }
    _onInit();
  }
})();
