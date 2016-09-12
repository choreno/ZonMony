var db = require('./model/db'),
    FolderModel = require('./model/folder'),
    ExpenseWithSimpleFolderModel = require('./model/expenseWithSimpleFolder'),
    ExpenseWithFolderModel = require('./model/expenseWithFolder'),
    FolderWithExpenseModel = require('./model/folderWithExpense'),
    ExpenseFolderModel = require('./model/expenseFolder'),

    LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader('./sqlServerData/simple.sql', { encoding: 'utf8', skipEmptyLines: true }),
    //lr = new LineByLineReader('./sqlServerData/AllExpenditures_Updated.sql', { encoding: 'utf8', skipEmptyLines: true }),

    folderArray = [],
    expenseWithSimpleFolderArray = [],
    expenseWithFolderArray = [],
    folderWithExpenseArray = [],
    expenseFolderArray = []
    ;

//When the error to read a sql server data file
lr.on('error', function (err) {
    console.log(err);
});


//Post processing after reading a file
lr.on('end', function () {


    //folder
    FolderModel.create(folderArray, function (err) {

        if (err) {
            console.log(err);
        } else {
            console.log('Successfully created a FolderModel collection');
        }

    });


    //ExpenseWithSimpleFolderModel
    ExpenseWithSimpleFolderModel.create(expenseWithSimpleFolderArray, function (err) {

        if (err) {
            console.log(err);
        } else {
            console.log('Successfully created a ExpenseWithSimpleFolderModel collection.');
        }

    });

    //ExpenseWithFolderModel
    ExpenseWithFolderModel.create(expenseWithFolderArray, function (err) {

        if (err) {
            console.log(err);
        } else {
            console.log('Successfully created a ExpenseWithFolderModel collection');
        }

    });

    //FolderWithExpenseModel
    FolderWithExpenseModel.create(folderWithExpenseArray, function (err) {

        if (err) {
            console.log(err);
        } else {
            console.log('Successfully created a FolderWithExpenseModel collection.');

        }

    });

    //ExpenseFolderModel
    ExpenseFolderModel.create(expenseFolderArray, function (err) {

        if (err) {
            console.log(err);
        } else {
            console.log('Successfully created a ExpenseFolderModel collection.');

        }

    });


});

//Reading a file line by line
lr.on('line', function (line) {


    //getting only useful data only from the line
    var index = line.indexOf('VALUES');
    var data = line.substring(index + 8);

    var splitData = data.split(',').map(x => x.trim());

    //[0] Id
    //[1] categoryDetailId
    //[2] payMonth
    //[3] payYear
    //[4] amount, need post processing
    //[5] N/A
    //[6, 7] description, note (need a null processing)
    //[8 ~ ] dttm, not ncessary

    var categoryDetailId = splitData[1];
    var payMonth = splitData[2];
    var payYear = splitData[3];
    var paymentDTTM = new Date(payYear, payMonth - 1, 1);


    var amount = /\d+.\d+/.exec(splitData[4]);
    var currencyAmount = parseFloat(amount[0]).toFixed(2);

    var forDescription = /N'(.*)'/.exec(splitData[6]);
    var description = forDescription != null ? forDescription[1] : null;

    var forNote = /N'(.*)'/.exec(splitData[7]);
    var note = forNote != null ? forNote[1] : null;

    //merging description and note into a new object
    if (description != null && note != null) {
        var mergedNote = description + ', ' + note;
    } else if (description == null && note == null) {
        var mergedNote = null;
    } else if (description == null && note != null) {
        var mergedNote = note;
    } else if (description != null && note == null) {
        var mergedNote = description;
    }

    //category detail processing
    var category = null;
    var title = null;
    var url = null;
    var isPayByCreditCard = false;
    var usages = {};
    var inactiveDTTM = null;
    var dueDate = 30;
    var folderNote = null;

    switch (parseInt(categoryDetailId)) {
        case 1:
            category = 'Housing';
            title = 'Mortgage';
            url = 'http://wellsfargo.com';
            usages.startDTTM = ['2010-4-21'];
            activeDTTM = new Date(2010, 3, 21);
            folderNote = 'Garison Way #58, Fixed 5.5%, 30 yrs';

            break;
        case 2:
            category = 'Housing';
            title = 'HOA';
            usages.startDTTM = ['2010-7-28'];
            activeDTTM = new Date(2010, 6, 28);
            folderNote = 'Garison Way';
            break;
        case 3:
            category = 'Utility';
            title = 'GRU';
            url = 'http://gru.com';
            usages.startDTTM = ['2009-9-23'];
            activeDTTM = new Date(2009, 8, 23);
            dueDate = 15;
            folderNote = 'Electricity';
            break;
        case 4:
            category = 'Utility';
            title = 'Verizon';
            url = 'http://verizonwireless.com';
            isPayByCreditCard = 'Y';
            usages.startDTTM = ['2009-9-18'];
            activeDTTM = new Date(2009, 8, 18);
            folderNote = 'Mobile phone since 2003';
            break;
        case 5:
            category = 'Utility';
            title = 'Cox';
            url = 'http://cox.com';
            isPayByCreditCard = 'Y';
            usages.startDTTM = ['2010-4-20'];
            activeDTTM = new Date(2010, 3, 20);
            dueDate = 24;
            folderNote = 'Internet';
            break;
        case 6:
            category = 'CreditCard';
            title = '(Citi)Double Cash';
            url = 'http://citi.com';
            usages.startDTTM = ['2015-2-2'];
            activeDTTM = new Date(2015, 1, 2);
            folderNote = 'Citi Card';
            break;
        case 7:
            category = 'CreditCard';
            title = '(Citi)Cash Returns';
            url = 'http://citi.com';
            usages.startDTTM = ['2009-8-12'];
            activeDTTM = new Date(2009, 7, 12);
            folderNote = 'Citi Card';
            break;
        case 8:
            category = 'CreditCard';
            title = '(Citi)Thank You';
            url = 'http://citi.com';
            usages.startDTTM = ['2012-3-2'];
            activeDTTM = new Date(2012, 2, 2);
            folderNote = 'Citi Card';
            break;
        case 9:
            category = 'CreditCard';
            title = '(Chase)Freedom';
            url = 'http://chase.com';
            usages.startDTTM = ['2013-8-25'];
            activeDTTM = new Date(2013, 7, 25);
            folderNote = 'Chase  Card';
            break;
        case 10:
            category = 'CreditCard';
            title = '(Chase)Sapphire';
            url = 'http://chase.com';
            usages.startDTTM = ['2014-6-23'];
            activeDTTM = new Date(2014, 5, 23);
            usages.endDTTM = ['2015-3-28'];
            inactiveDTTM = new Date(2015, 2, 28);
            folderNote = 'Chase  Card';
            break;
        case 11:
            category = 'CreditCard';
            title = '(CapitalOne)QuickSilver-Master';
            url = 'http://capitalone.com';
            usages.startDTTM = ['2010-7-28'];
            activeDTTM = new Date(2010, 6, 28);
            usages.endDTTM = ['2016-5-28'];
            inactiveDTTM = new Date(2016, 4, 28);
            folderNote = 'Capital One Card';

            break;
        case 12:
            category = 'CreditCard';
            title = '(CapitalOne)QuickSilver-Visa';
            url = 'http://capitalone.com';
            usages.startDTTM = ['2010-7-28'];
            activeDTTM = new Date(2010, 6, 28);
            usages.endDTTM = ['2016-5-28'];
            inactiveDTTM = new Date(2016, 4, 28);
            folderNote = 'Capital One Card';
            break;
        case 13:
            category = 'CreditCard';
            title = '(TDBank)Cash Reward';
            url = 'http://tdcardservice.com';
            usages.startDTTM = ['2014-10-22'];
            activeDTTM = new Date(2014, 9, 22);
            usages.endDTTM = ['2016-5-28'];
            inactiveDTTM = new Date(2016, 4, 28);
            folderNote = 'TDBank Card';
            break;
        case 14:
            category = 'CreditCard';
            title = '(Synchrony)hhgregg';
            url = 'http://mysynchrony.com';
            usages.startDTTM = ['2010-5-28'];
            activeDTTM = new Date(2010, 4, 28);
            dueDate = 15;
            folderNote = 'hhgregg card';
            break;
        case 15:
            category = 'CreditCard';
            title = '(BOA)Power Reward';
            url = 'http://bankofamerica.com';
            usages.startDTTM = ['2009-11-28'];
            activeDTTM = new Date(2009, 10, 28);
            usages.endDTTM = ['2016-5-28'];
            inactiveDTTM = new Date(2016, 4, 28);
            folderNote = 'Bank Of America Card';
            break;
        case 16:
            category = 'CreditCard';
            title = '(WellsFargo)Platinum';
            url = 'http://wellsfargo.com';
            usages.startDTTM = ['2011-1-28'];
            activeDTTM = new Date(2011, 0, 28);
            folderNote = 'Wells Fargo Card';
            break;
        case 17:
            category = 'CreditCard';
            title = '(AMEX)BlueCash';
            url = 'http://americanexpress.com';
            usages.startDTTM = ['2013-9-28'];
            activeDTTM = new Date(2013, 8, 28);
            usages.endDTTM = ['2014-3-25'];
            inactiveDTTM = new Date(2014, 2, 25);
            folderNote = 'American Express Card';
            break;
        case 18:
            category = 'CreditCard';
            title = '(AMEX)Premier Gold';
            url = 'http://americanexpress.com';
            usages.startDTTM = ['2014-8-7'];
            activeDTTM = new Date(2014, 7, 7);
            usages.endDTTM = ['2014-12-28'];
            inactiveDTTM = new Date(2014, 11, 28);
            folderNote = 'American Express Card';
            break;
        case 19:
            category = 'CreditCard';
            title = '(AMEX)Premier Rewards';
            url = 'http://americanexpress.com';
            usages.startDTTM = ['2015-8-4'];
            activeDTTM = new Date(2015, 7, 4);
            usages.endDTTM = ['2016-5-28'];
            inactiveDTTM = new Date(2016, 4, 28);
            folderNote = 'American Express Card';
            break;

        case 20:
            category = 'Check';
            title = 'Check';
            usages.startDTTM = ['2011-1-20'];
            activeDTTM = new Date(2011, 0, 20);

            break;
        case 21:
            category = 'Special Expense';
            title = 'Western Union';
            url = 'https://www.westernunion.com/us/en/home.html';
            usages.startDTTM = ['2015-1-28'];
            activeDTTM = new Date(2015, 0, 28);
            folderNote = 'Transfer money';
            break;
        case 22:
            category = 'CreditCard';
            title = '(CFNA)Honda';
            url = 'https://www.cfna.com/';
            usages.startDTTM = ['2015-8-28'];
            activeDTTM = new Date(2015, 7, 28);
            dueDate = 15;
            folderNote = 'Honda Auto Card';
            break;
        case 23:
            category = 'Car';
            title = 'Honda Accord';
            usages.startDTTM = ['2009-9-1'];
            activeDTTM = new Date(2009, 8, 1);
            usages.endDTTM = ['2010-7-21'];
            inactiveDTTM = new Date(2010, 6, 21);
            folderNote = 'Loan of Honda Accord';
            break;
        case 24:
            category = 'Car';
            title = 'Honda Odyssey';
            usages.startDTTM = ['2009-9-1'];
            activeDTTM = new Date(2009, 8, 1);
            usages.endDTTM = ['2013-7-21'];
            inactiveDTTM = new Date(2013, 6, 21);
            folderNote = 'Loan of Honda Odyssey';
            break;
        case 25:
            category = 'Housing';
            title = 'Magnolia APT';
            usages.startDTTM = ['2009-9-1'];
            activeDTTM = new Date(2009, 8, 1);
            usages.endDTTM = ['2010-2-28'];
            inactiveDTTM = new Date(2010, 1, 28);
            folderNote = 'Apartment';
            break;
        case 26:
            category = 'Utility';
            title = 'HBL Utility Fee';
            usages.startDTTM = ['2009-9-1'];
            activeDTTM = new Date(2009, 8, 1);
            usages.endDTTM = ['2010-2-20'];
            inactiveDTTM = new Date(2010, 1, 20);
            folderNote = 'Apartment Utility';
            break;
        case 27:
            category = 'Utility';
            title = '001 Communication';
            usages.startDTTM = ['2009-11-11'];
            activeDTTM = new Date(2009, 10, 11);
            usages.endDTTM = ['2010-3-30'];
            inactiveDTTM = new Date(2010, 2, 30);
            folderNote = 'Long Distance Call';
            break;
        case 28:
            category = 'Utility';
            title = 'AT&T Telephone';
            usages.startDTTM = ['2009-9-22'];
            activeDTTM = new Date(2009, 8, 22);
            usages.endDTTM = ['2010-4-30'];
            inactiveDTTM = new Date(2010, 3, 30);
            folderNote = 'Resident Phone Service';
            break;
        case 29:
            category = 'Computer';
            title = 'Dell';
            url = 'http://dell.com';
            usages.startDTTM = ['2013-1-1'];
            activeDTTM = new Date(2013, 0, 1);
            usages.endDTTM = ['2013-7-21'];
            inactiveDTTM = new Date(2013, 6, 21);
            folderNote = 'Sunny PC';
            break;
        case 1030:
            category = 'Car';
            title = 'MB GLA250';
            usages.startDTTM = ['2016-1-1'];
            activeDTTM = new Date(2016, 0, 1);
            dueDate = 15;
            folderNote = 'Loan of MBenz GLA250, 8 years';
            break;


    }


    //folder

    var folder = new FolderModel({
        name: category,
        tab: title,
        url: url,
        dueDate: dueDate,
        payByCreditCard: isPayByCreditCard,
        note: folderNote,
        status: [{ activeDTTM: activeDTTM, inactiveDTTM: inactiveDTTM }]
    });

    var index = folderArray.map(function (e) {
        return e.tab
    }).indexOf(title);

    if (index === -1) {
        folderArray.push(folder);
    }


    //expenseWithSimpleFolder
    var expenseWithSimpleFolder = new ExpenseWithSimpleFolderModel({
        folder: [{
            _id: folder._id,
            name: folder.name,
            tab: folder.tab,
        }],
        amount: currencyAmount,
        note: mergedNote,
        paymentDTTM: paymentDTTM,
    });

    expenseWithSimpleFolderArray.push(expenseWithSimpleFolder);

    //expenseWithFolder
    var expenseWithFolder = new ExpenseWithFolderModel({
        folder: [{
            name: category,
            tab: title,
            url: url,
            dueDate: dueDate,
            payByCreditCard: isPayByCreditCard,
            note: folderNote,
            status: [{ activeDTTM: activeDTTM, inactiveDTTM: inactiveDTTM }]
        }],
        amount: currencyAmount,
        note: mergedNote,
        paymentDTTM: paymentDTTM,
    });

    expenseWithFolderArray.push(expenseWithFolder);


    //folderWithExpense
    var folderWithExpense = new FolderWithExpenseModel({
        folder: category,
        tab: title,
        url: url,
        dueDate: dueDate,
        payByCreditCard: isPayByCreditCard,
        note: folderNote,
        status: [{ activeDTTM: activeDTTM, inactiveDTTM: inactiveDTTM }],
        payment: [
            {
                amount: currencyAmount,
                note: mergedNote,
                paymentDTTM: paymentDTTM,
            }
        ]

    });

    var index = folderWithExpenseArray.map(function (e) {
        return e.tab
    }).indexOf(title);

    if (index === -1) {
        folderWithExpenseArray.push(folderWithExpense);
    }
    else {

        folderWithExpenseArray[index].payment.push({
            amount: currencyAmount,
            note: mergedNote,
            paymentDTTM: paymentDTTM
        });
    }

    //expenseFolder 

    var expenseFolder = new ExpenseFolderModel({
        name: category,
        tab: title,
        url: url,
        dueDate: dueDate,
        payByCreditCard: isPayByCreditCard,
        note: folderNote,
        statusDTTM: [{
            start: activeDTTM,
            end: inactiveDTTM
        }],
        payment: [
            {
                amount: currencyAmount,
                note: mergedNote,
                paymentDTTM: paymentDTTM,
                month: payMonth,
                year: payYear
            }
        ]

    });

    var index = expenseFolderArray.map(function (e) {
        return e.tab
    }).indexOf(title);

    if (index === -1) {
        expenseFolderArray.push(expenseFolder);
    }
    else {

        expenseFolderArray[index].payment.push({
            amount: currencyAmount,
            note: mergedNote,
            paymentDTTM: paymentDTTM,
            month: payMonth,
            year: payYear
        });
    }


});
