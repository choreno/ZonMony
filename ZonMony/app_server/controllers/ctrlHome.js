var request = require('request');

var apiOptions = { server: 'http://localhost:3000' };


//Adding the target years
var years = [];
var startYear = 2009;
var currentYear = 2016;

for (var i = startYear + 1; i <= currentYear; i++) {
    years.push(i);
}

var renderHomePage = function (req, res, responseBody) {

	var message;
	if (!(responseBody instanceof Array)) {
		message = 'API lookup error';
		responseBody = [];
	}
	else {
		if (!responseBody.length) {
			message = 'No folder found';
		}
	}


	res.render('home.handlebars',
        {
			message: message,
            title: 'R+L Carriers - Express',
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            years: years,
			myName: 'Matti Simon',
			folders: responseBody,
        });
};


var renderDetailPage = function (req, res, folderInfo) {

	var message;

	if (folderInfo.length == 0) {
		message = 'No folderInfo found';
	}



	res.render('home.handlebars',
        {
			message: message,
            title: 'R+L Carriers - Render Detail ???',
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            years: years,
			myName: folderInfo.name,
			folderInfo: folderInfo,
        });
};




module.exports.index = function (req, res) {

	//Get all folders list 
	var requestOptions = {
		url: apiOptions.server + '/api/',
		method: 'GET',
		json: {},
		qs: {},
	};

	request(requestOptions, function (err, response, body) {

		//do something here whateever you want to !!
		var data = body;


		//sending the updated body
		renderHomePage(req, res, body);

	});


}


module.exports.folderInfo = function (req, res) {

	//Get a folder info
	var restUrl = apiOptions.server + '/api/' + req.params.folderId;

	var requestOptions = {
		url: restUrl,
		method: 'GET',
		json: {},
		qs: {},
	};

	request(requestOptions, function (err, response, body) {

		//sending the updated body
		renderDetailPage(req, res, body);

	});


}












