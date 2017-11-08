(function() {
  'use strict';

  angular
    .module('common')
    .filter('ageFilter', ageFilter);

  function ageFilter() {
    function calculateAge(birthDate) {
      var ageDiffMs = Date.now() - Date.parse(birthDate);
      var ageDate = new Date(ageDiffMs);

      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    return function(birthDate) {
      return calculateAge(birthDate);
    };
  }

})();
