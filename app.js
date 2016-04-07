var express = require('express');
var mongoStroe = require('connect-mongo')(express);
var path = require('path');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var app = express();
var dbUrl = 'mongodb://localhost/movie';

mongoose.connect(dbUrl);

app.set('views','./app//views/pages');
app.set('view engine','jade');
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.multipart());
app.use(express.session({
	secret:'liu',
	store:new mongoStroe({
		url:dbUrl,
		collection:'sessions'
	})
}));
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
app.listen(port);

if('development' === app.get('env')){
	app.set('showStackError',true);
	app.use(express.logger(":method :url :status"));
	app.locals.pretty = true;
	mongoose.set('debug',true);
}

require('./config/routes')(app);

console.log('imooc started on port'+ port);
