(function() {
  'use strict';

  angular
    .module('user')
    .controller('UserController', ['$scope', '$uibModal', '$state', 'ngTableParams', 'ngTableEventsChannel', 'UserService', UserController]);

  function UserController($scope, $uibModal, $state, ngTableParams, ngTableEventsChannel, UserService) {
    var vm = this;

    /**
     * Property responsible for counting the number of rows selected.
     * @type {number}
     */
    vm.selectedRowsLength = 0;

    vm.deleteMultipleRows = deleteMultipleRows;
    vm.generateCsv = generateCsv;
    vm.linkCsv = linkCsv;

    /**
     * This function broadcast the 'deleteSelectedRows' event.
     * The listener of this event is responsible for deleting multiple user rows.
     */
    function deleteMultipleRows() {
      $scope.$broadcast('deleteSelectedRows');
    }

    /**
     * [ngTableToCsv] generate function
     * This is one of the functions responsible for generating a CSV file with the selected user rows.
     */
    function generateCsv() {
      vm.csv.generate();
    }

    /**
     * [ngTableToCsv] link function
     * This is one of the functions responsible for generating a CSV file with the selected user rows.
     */
    function linkCsv() {
      if (vm.selectedRowsLength == 0)
        return '';

      return vm.csv.link();
    }

    /**
     * Listener responsible for increasing the number of rows selected
     */
    $scope.$on('increaseSelectedRowsLength', function() {
      vm.selectedRowsLength++;
    });

    /**
     * Listener responsible for decreasing the number of rows selected
     */
    $scope.$on('decreaseSelectedRowsLength', function() {
      vm.selectedRowsLength--;
    });

    /**
     * Listener responsible for displaying a modal with specific details (firstName, lastName and age) of a user.
     */
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

    /**
     * Listener responsible for redirecting to the user details page, passing as argument the userId.
     */
    $scope.$on('editUser', function(event, args) {
      $state.go('detail', { id: args });
    });

    /**
     * Listener responsible for deleting a specific user and updating the user table.
     */
    $scope.$on('deleteUser', function(event, args) {
      UserService.deleteUser(args);

      _reloadUserTable();
    });

    /**
     * Function responsible for fetching users from the UserService and initialize the user table.
     * @private
     */
    function _fetchUsers() {
      UserService.fetchUsers(function() {
        _runUserTable();
      });
    }

    /**
     * Function responsible for restart the number of selected rows when clicking in a pagination item.
     * @private
     */
    function _registerOnPagesChangedEvent() {
      ngTableEventsChannel.onPagesChanged(function() {
        vm.selectedRowsLength = 0;
      });
    }

    /**
     * Function responsible for updating the user table.
     * @private
     */
    function _reloadUserTable() {
      vm.tableData.reload();
    }

    /**
     * Function responsible for initialize the user table.
     * @private
     */
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
