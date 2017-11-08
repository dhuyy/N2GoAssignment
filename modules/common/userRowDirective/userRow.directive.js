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
        userId: '=',
        firstName: '@',
        lastName: '@',
        email: '@',
        dateOfBirth: '@',
        country: '@'
      },
      controller: function($scope) {
        var $ctrl = this;

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
