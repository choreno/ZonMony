//cbc test 2 3 4

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//require('./app_server/models/db');  //mongoose db connetion
require('./app_api/models/db');  //change to api mongoose db connetion


var readline = require('readline');
if (process.platform === "win32") {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on("sigint", function () {
        process.emit("sigint");
    });
}

//var routes = require('./routes/index');
//var users = require('./routes/users');

var routes = require('./app_server/routes/index');
var users = require('./app_server/routes/users');

var routesApi = require('./app_api/routes/apiIndex'); 

var app = express();

var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({
	defaultLayout: 'layout',
	layoutsDir: path.join(__dirname, 'app_server', 'views','layouts')
}));
app.set('view engine', 'handlebars');

app.set('views', path.join(__dirname, 'app_server', 'views'));



// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//angular
app.use(express.static(path.join(__dirname, 'app_client')));

app.use('/', routes);
app.use('/api', routesApi);  //it makes only use the api routes


app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
