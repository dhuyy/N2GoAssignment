(function() {
  'use strict';

  angular
    .module('app')
    .constant('SERVER', {
      'ENDPOINTS': {
        'GET_USERS': '../../../data/users.json'
      }
    });

})();
