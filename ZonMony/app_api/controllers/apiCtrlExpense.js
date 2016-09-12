var mongoose = require('mongoose'),
	//FolderModel = require('../models/folder'),
	//ExpenseModel = require('../models/expense');
	moment = require('moment');
	ExpenseModel = require('../models/expenseFolder');

//moment().format();

mongoose.Promise = global.Promise; //works to remove promise deprecated warnings???

var sendJsonResponse = function (res, status, content) {
	res.status(status);
	res.json(content);
}


module.exports.deletePayment = function (req, res) {

	if (!req.params.folderId) {
		sendJsonResponse(res, 404, { message: 'Not found, folder id is required' });
		return;
	}


	ExpenseModel.findById(req.params.folderId, function (err, folder) {

		if (!folder) {
			sendJsonResponse(res, 404, { message: 'folder is not found.' });
			return;
		} else if (err) {
			sendJsonResponse(res, 400, err);
			return;
		}

		//get the subdoc, payment and remove
		folder.payment.id(req.params.paymentId).remove(); 
		
		folder.save(function (err, folder) {
			if (err) {
				sendJsonResponse(res, 400, err);

			}
			else
				sendJsonResponse(res, 200, folder);
		});

	});



} ; 


module.exports.deleteFolder = function (req, res) {

	var folderId = req.params.folderId; 
	

	if (folderId) {

		ExpenseModel.findByIdAndRemove(folderId, function (err, folder) {
			if (err) {
				sendJsonResponse(res, 404, err);
				return;
			}
			sendJsonResponse(res, 204, null); // no message for delete api???
		});

	}
	else {
		sendJsonResponse(res, 404, { message: 'No folderId' }); 
		return; 
	}

};




module.exports.updatePayment = function (req, res) {
	
	if (!req.params.folderId) {
		sendJsonResponse(res, 404, { message: 'Not found, folder id is required' });
		return;
	}


	ExpenseModel.findById(req.params.folderId, function (err, folder) {
		
		if (!folder) {
			sendJsonResponse(res, 404, { message: 'folder is not found.' });
			return;
		} else if (err) {
			sendJsonResponse(res, 400, err); 
			return; 
		}

		//*** get the subdoc, payment
		thisPayment = folder.payment.id(req.params.paymentId);

		//update payment
		thisPayment.amount = req.body.amount;
		thisPayment.note = req.body.note;
		thisPayment.paymentDTTM = req.body.paymentDTTM;
		thisPayment.updatedDTTM = new Date();

		folder.save(function (err, folder) {
			if (err) {
				sendJsonResponse(res, 400, err);

			}
			else
				sendJsonResponse(res, 200, folder); 
		});

	});
	
};




module.exports.updateFolder = function (req, res) {

	if (!req.params.folderId) {
		sendJsonResponse(res, 404, { message: 'Not found, folder id is required' });
		return;
	}

	ExpenseModel.findById(req.params.folderId, function (err, folder) {

		if (!folder) {
			sendJsonResponse(res, 404, { message: 'folder is not found' });
			return;
		} else if (err) {
			sendJsonResponse(res, 400, err);
			return;
		}

		//update expense
		folder.name = req.body.name;
		folder.tab = req.body.tab;
		folder.url = req.body.url;
		folder.dueDate = req.body.dueDate;
		folder.payByCreditCard = req.body.payByCreditCard;
		folder.note = req.body.note;
		folder.statusDTTM = [{
			start: req.body.start,
			end: req.body.end
		}];
		folder.updatedDTTM = new Date();

		//save
		folder.save(function (err, folder) {

			if (err) {
				sendJsonResponse(res, 404, err);
			}
			else {
				sendJsonResponse(res, 200, folder);
			}

		});

	}).select('-payment');


}

module.exports.createPayment = function (req, res) {

	var folderId = req.params.folderId;

	if (folderId) {
		ExpenseModel.findById(folderId, function (err, folder) {
			if (err) {
				sendJsonResponse(res, 404, err);
				return;
			}
			else {
				//add a NEW payment !!!
				folder.payment.push({
					amount: req.body.amount,
					note: req.body.note2,
					paymentDTTM: new Date(),
					createdDTTM: new Date(),
					updatedDTTM: new Date()
				});

				folder.save(function (err, folder) {
					if (err) {
						sendJsonResponse(res, 400, err);
					} else {
						sendJsonResponse(res, 201, folder);
					}

				});
			}

		}).select('payment');
	}
	else {
		sendJsonResponse(res, 404, { message: 'Not Found, folder Id required' });
	}




}

module.exports.createFolder = function (req, res) {

	ExpenseModel.create({

		name: req.body.name,
		tab: req.body.tab,
		url: req.body.url,
		dueDate: req.body.dueDate,
		payByCreditCard: req.body.payByCreditCard,
		note: req.body.note,

		statusDTTM: [{
			start: new Date(),
			end: null
		}],
		payment: [{
			amount: req.body.amount,
			note: req.body.note2,
			paymentDTTM: new Date(),
			createdDTTM: new Date(),
			updatedDTTM: new Date()

		}],
		createdDTTM: new Date(),
		updatedDTTM: new Date(),

	}, function (err, folder) {
		if (err) {
			sendJsonResponse(res, 400, err);
		}
		else {
			sendJsonResponse(res, 201, folder);
		}

	});


}


module.exports.getFolder = function (req, res) {
	

	//get all
	ExpenseModel.find({}, function (err, folder) {

		if (!folder) {
			sendJsonResponse(res, 404, { message: 'folder is not found' });
			return;
		}
		else if (err) {
			sendJsonResponse(res, 404, err);
			return;
		}


		sendJsonResponse(res, 200, folder);
	});

	
	;


}

module.exports.getFolderById = function (req, res) {

	if (req.params && req.params.folderId) {

		ExpenseModel.findById(req.params.folderId, function (err, folder) {
			if (!folder) {
				sendJsonResponse(res, 404, { message: 'folder is not found' });
				return;
			}
			else if (err) {
				sendJsonResponse(res, 404, err);
				return;
			}

			sendJsonResponse(res, 200, folder);

		});
		

	}
	else {
		sendJsonResponse(res, 404, { message: 'No folder id in request' });
	}

}

module.exports.getFoldersByDTTM = function(req,res){

	// var month = parseInt(req.query.month); 
	// var year = parseInt(req.query.year); 

	// var year = req.body.year;
	// var month = req.body.month; 
	 
	//ExpenseModel.find({'payment.paymentDTTM':{'$gte': new Date(year,month+1,1), '$lt':new Date(year,month+1,30)} }
	ExpenseModel.find(
		{'payment':{ $elemMatch:{year:parseInt(req.query.year), month: parseInt(req.query.month)} }},
		{ 'name': 1, 'tab':1, 'payment.$': 1 },
	 function (err, folder) {

		if (!folder) {
			sendJsonResponse(res, 404, { message: 'folder is not found' });
			return;
		}
		else if (err) {
			sendJsonResponse(res, 404, err);
			return;
		}


		sendJsonResponse(res, 200, folder);
	})
	
	
	;


}



