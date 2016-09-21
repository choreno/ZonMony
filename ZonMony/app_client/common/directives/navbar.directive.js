
(function () {

  angular
    .module('zonMonyApp')
    .directive('navbar', navbar);

  function navbar () {
    return {
      restrict: 'EA',
      scope: {
          content: '=content'
      },
      templateUrl: '/common/directives/navbar.template.html',
     
    };
  }

})();
