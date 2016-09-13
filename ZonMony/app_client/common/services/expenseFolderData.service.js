angular.module('zonMonyApp')
	.service('expenseFolderData', expenseFolderData);

function expenseFolderData($http) {

	//This service need to have such capabilities, 
	// 1. provides total expenses($$$) from start year to until now
	// 2. provides expense data for current month and year
	// 3. provides unique folder list

	//get all expenses
	var getAllExpenses = function () {
		return $http.get('/api');
	};


	//add more services from here !!!!!!!!  ---------------------------------------------------

	//get current DTTM expenses
	var getCurrentExpenses = function (year, month) {

		return $http.get('/api/folder?year=' + year + '&month=' + month);

	};


	//Return all services menu !!

	return {
		getAllExpenses: getAllExpenses,
		getCurrentExpenses: getCurrentExpenses
	};




}


