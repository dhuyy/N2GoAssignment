(function() {
  'use strict';

  angular
    .module('app')
    .config(['$stateProvider', '$urlRouterProvider', routerConfig]);

  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('users', {
        url: '/users',
        templateUrl: 'user/user.html',
        controller: 'UserController',
        controllerAs: 'vm'
      })
      .state('detail', {
        url: '/users/:id',
        templateUrl: 'detail/detail.html',
        controller: 'DetailController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/users');
  }

})();
