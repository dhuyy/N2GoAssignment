(function() {
  'use strict';

  angular
    .module('detail')
    .controller('DetailController', ['$stateParams', DetailController]);

  function DetailController($stateParams) {
    var vm = this;

    vm.id = $stateParams.id;
  }
})();
