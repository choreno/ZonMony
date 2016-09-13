angular.module('zonMonyApp')
	.service('expenseData', expenseData);


function expenseData($http) {

	//return $http.get('/api');
	return $http.get('/api/folder?year=2015&month=1');

}


