var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var loginHandler = require('./backend/login.js');
var customerFunctions = require('./backend/customerFunctions.js');
var globals = require('./globals');

app.use(session({
	secret: "29b005b8392fd39458e8c50bc764fffa3320f212",
	resave: false,
	saveUninitialized: false,
	cookie: {
		name: "sid"
	}
}));

app.use('/static', express.static(path.join(__dirname, '/public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : true
}));

SERVER_URI_PREFIX = globals.SERVER_URI_PREFIX;
SERVER_PORT = globals.SERVER_PORT;

//Routing

app.get('/', function(req, res){
   if (req.session.userDetails)
	{	
		res.redirect(302, SERVER_URI_PREFIX + "/arith");
	}
	else
	{	
		res.status(200);
		res.setHeader("Content-Type", "text/html");
		res.sendFile(path.join(__dirname, '/index.html'));
	}
});

app.post('/logout', loginHandler.logout);

app.post('/login', function(req,res)
{
	loginHandler.login(req, res, function(status,message)
	{
		res.status(status).end(message);
	});
});

app.get('/globals', loginHandler.checkSession, function(req, res)
{
	var response = {};
	response.status_code = 200;
	response.globals = globals;
	res.json(response);
});

app.get('/arith',loginHandler.checkSession,function(req, res)
{
	res.sendFile(path.join(__dirname, '/public/views/postLogin.html'));
});

app.get("/getUserDetails", loginHandler.checkSession, customerFunctions.getUserDetails);
app.post("/add", loginHandler.checkSession, customerFunctions.addNumbers);
app.post("/sub", loginHandler.checkSession, customerFunctions.subNumbers);
app.post("/mul", loginHandler.checkSession, customerFunctions.mulNumbers);
app.post("/div", loginHandler.checkSession, customerFunctions.divNumbers);

app.listen(3000);