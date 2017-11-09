(function() {
  'use strict';

  angular
    .module('common')
    .directive('userRow', [userRow]);

  function userRow() {
    return {
      restrict: 'A',
      replace: true,
      scope: {},
      bindToController: {
        userId: '@',
        firstName: '@',
        lastName: '@',
        email: '@',
        dateOfBirth: '@',
        country: '@'
      },
      controller: function($scope) {
        var $ctrl = this;

        $ctrl.checked = false;

        $ctrl.checkUncheckRow = function() {
          $ctrl.checked = !$ctrl.checked;

          if ($ctrl.checked)
            $scope.$emit('increaseSelectedRowsLength');
          else
            $scope.$emit('decreaseSelectedRowsLength');
        };

        $ctrl.showUser = function() {
          $scope.$emit('showUser', {
            firstName: $ctrl.firstName,
            lastName: $ctrl.lastName,
            dateOfBirth: $ctrl.dateOfBirth
          });
        };

        $ctrl.editUser = function() {
          $scope.$emit('editUser', $ctrl.userId);
        };

        $ctrl.deleteUser = function() {
          if ($ctrl.checked)
            $scope.$emit('decreaseSelectedRowsLength');

          $scope.$emit('deleteUser', $ctrl.userId);
        };
      },
      controllerAs: '$ctrl',
      templateUrl: 'common/userRowDirective/userRow.html',
      link: function(scope, el) {

      }
    }
  }
})();
