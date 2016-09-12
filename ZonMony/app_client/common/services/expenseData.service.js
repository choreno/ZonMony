angular.module('moneyzoneApp')
	.service('expenseData', expenseData);


function expenseData($http) {

	return $http.get('/api');

}


