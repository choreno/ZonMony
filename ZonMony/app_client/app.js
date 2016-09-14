﻿angular.module('zonMonyApp', ['ngRoute','ui.bootstrap']);

function config($routeProvider) {

	$routeProvider
		.when('/', {
			templateUrl: 'home/home.view.html',
			controller: 'homeCtrl',
			controllerAs: 'vm'

		})
		.otherwise({redirectTo: '/'});
};


angular.module('zonMonyApp')
	.config(['$routeProvider', config]);
