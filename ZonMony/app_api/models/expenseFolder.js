var mongoose = require('mongoose');

var statusSchema = new mongoose.Schema({

	start: Date,
	end: Date

}, { _id: false })

var paymentSchema = new mongoose.Schema({

	amount: { type: Number, default: 0.00 },
	note: String,
	paymentDTTM: Date,
	createdDTTM: { type: Date, default: Date.now },
	updatedDTTM: { type: Date, default: Date.now }

});

var expenseFolderSchema = new mongoose.Schema({

	name: String,
	tab: String,
	url: String,
	dueDate: Number,
	payByCreditCard: Boolean,
	note: String,
	statusDTTM: [statusSchema],
	payment: [paymentSchema],
	// payment: [{type: mongoose.Schema, ref:'paymentSchema'}],
	createdDTTM: { type: Date, default: Date.now },
	updatedDTTM: { type: Date, default: Date.now }

});


module.exports = mongoose.model('ExpenseFolder', expenseFolderSchema, 'expenseFolder'); 
