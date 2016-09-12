﻿var mongoose = require('mongoose');

var statusSchema = new mongoose.Schema({

    activeDTTM: [Date],
    inactiveDTTM: [Date]

}, { _id: false })

var folderSchema = new mongoose.Schema({

    name: String,
    tab: String,
    url: String,
    dueDate: Number,
    payByCreditCard: Boolean,
    note: String,
    status: [statusSchema],
    createdDTTM: { type: Date, default: Date.now },
    updatedDTTM: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Folder', folderSchema, 'folder'); 
//mongoose.model('Folder', folderSchema, 'folder'); 