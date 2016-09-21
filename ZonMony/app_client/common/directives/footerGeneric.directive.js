

(function () {

  angular
    .module('zonMonyApp')
    .directive('footerGeneric', footerGeneric);

  function footerGeneric () {
    return {
      restrict: 'EA',
      templateUrl: '/common/directives/footerGeneric.template.html'
    };
  }

})();
