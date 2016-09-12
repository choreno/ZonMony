angular.module('zonMonyApp')
	.service('expenseData', expenseData);


function expenseData($http) {

	return $http.get('/api');

}


