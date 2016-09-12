var mongoose = require('mongoose');


//var statusSchema = new mongoose.Schema({

//	activeDTTM: [Date],
//	inactiveDTTM: [Date]

//}, { _id: false })

var folderSchema = new mongoose.Schema({

	_id: { type: mongoose.Schema.Types.ObjectId, ref: 'folder' },
	name: { type: String, ref: 'folder' },
	tab: { type: String, ref: 'folder' },
});

var paymentSchema = new mongoose.Schema({

    amount: { type: Number, default: 0.00 },
    note: String,
    paymentDTTM: Date

}, { _id: false });


var expenseSchema = new mongoose.Schema({

	folder: [folderSchema],
    //payment: [paymentSchema],
	amount: { type: Number, default: 0.00 },
	note: String,
	paymentDTTM: Date,
    createdDTTM: { type: Date, default: Date.now },
    updatedDTTM: { type: Date, default: Date.now }

});


module.exports = mongoose.model('ExpenseWithSimpleFolder', expenseSchema, 'expenseWithSimpleFolder');
