angular.module('zonMonyApp')
	.controller('homeCtrl', homeCtrl);




function homeCtrl(expenseFolderData) {

	var vm = this;



vm.alerts = [
    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];

  vm.addAlert = function() {
    vm.alerts.push({msg: 'Another alert!'});
  };

  vm.closeAlert = function(index) {
    vm.alerts.splice(index, 1);
  };















	vm.pageHeader = 'ttt';

	vm.message = 'Checking your expenses ...';


	//Alert!, $http.get returns a promise with two methods, success and error
	expenseFolderData.getAllExpenses()
		.success(function (data) {

			//calculate total expenses, -- do not add paybycreditcard items
			let sum = 0;
			for (let i in data) {
				if (data[i].payByCreditCard == false) {
					for (let j in data[i].payment) {
						sum = sum + data[i].payment[j].amount;
					}
				}
			}
			console.log(sum);

			vm.total = sum;

			// vm.grandTotal = '$' + sum;
			vm.grandTotal = sum;


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
			console.log(data);
			vm.folders = [...new Set(data.map(x => x.name))].sort();

			let sum = 0;
			for (let i in data) {
				if (data[i].payByCreditCard == false) {
					for (let j in data[i].payment) {
						sum = sum + data[i].payment[j].amount;
					}
				}
			}

			//vm.monthlyTotal = '$' + sum ; 
			vm.monthlyTotal = sum ;
			vm.message = null; 

		})
		.error(function (err) {
			console.log(err);
		})


}


