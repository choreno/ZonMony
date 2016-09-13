angular.module('zonMonyApp')
	.controller('homeCtrl', homeCtrl)



function homeCtrl(expenseFolderData) {

	var vm = this;

	vm.pageHeader = 'ttt';

	vm.message = 'Checking your expenses...';


	//Alert!, $http.get returns a promise with two methods, success and error
	expenseFolderData.getAllExpenses()
		.success(function (data) {

			//calculate total expenses, -- do not add paybycreditcard items
			let sum = 0 ; 
			for(let i in data){
				console.log(data[i].payByCreditCard);
				if(data[i].payByCreditCard == false){
				for(let j in data[i].payment){
					sum = sum+data[i].payment[j].amount ;
				}
				}
			}
			console.log(sum);

			vm.total = sum ;  

			vm.pageHeader = '$' + sum ; 
			

		})
		.error(function (err) {
			console.log(err);
		});




	var now = new Date();
	// var year = now.getFullYear();
	// var month = now.getMonth(); 
	var year = 2015;
	var month = 1;

	expenseFolderData.getCurrentExpenses(year, month)
		.success(function (data) {
			vm.expenses = data;
			vm.folders = [...new Set(data.map(x => x.name))].sort();
		})
		.error(function (err) {
			console.log(err);
		})




}


