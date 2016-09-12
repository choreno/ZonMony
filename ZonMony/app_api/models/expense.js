﻿var mongoose = require('mongoose');


 var statusSchema = new mongoose.Schema({

	 activeDTTM: [Date],
	 inactiveDTTM: [Date]

 }, { _id: false })

 var paymentSchema = new mongoose.Schema({

	 amount: { type: Number, default: 0.00 },
	 note: String,
	 paymentDTTM: Date,
	 createdDTTM: { type: Date, default: Date.now },
	 updatedDTTM: { type: Date, default: Date.now }

 }, { _id: false });

 var folderWithExpenseSchema = new mongoose.Schema({

	 folder: String,
	 tab: String,
	 url: String,
	 dueDate: Number,
	 payByCreditCard: Boolean,
	 note: String,
	 status: [statusSchema],
	 payment: [paymentSchema],
	 createdDTTM: { type: Date, default: Date.now },
	 updatedDTTM: { type: Date, default: Date.now }

 });

module.exports = mongoose.model('Expense', folderWithExpenseSchema, 'expense');

