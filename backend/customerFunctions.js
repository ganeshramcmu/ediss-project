var mysqlConnection = require('./mysqlConnection');

module.exports = {};

module.exports.getUserDetails = function(req, res){

	var response = {};
	response.statusCode = 200;
	response.userDetails = req.session.userDetails;
	res.status(200).send(JSON.stringify(response));
	
};

module.exports.addNumbers = function(req, res){
	
	var num1 = Number(req.body.num1);
	var num2 = Number(req.body.num2);

	response = {}
	statusCode = 200;
	response.message="The action was successful";

	if(typeof num1 == 'number' && typeof num2 == 'number'){
		response.result = num1 + num2;
	} else {
		statusCode = 422;
		response.message = "The numbers you entered are not valid";
	}
	res.status(statusCode).send(JSON.stringify(response));
}

module.exports.subNumbers = function(req, res){
	var num1 = Number(req.body.num1);
	var num2 = Number(req.body.num2);

	response = {}
	statusCode = 200;
	response.message="The action was successful";

	if(typeof num1 == 'number' && typeof num2 == 'number'){
		response.result = num1 - num2;
	} else {
		statusCode = 422;
		response.message = "The numbers you entered are not valid";
	}
	res.status(statusCode).send(JSON.stringify(response));
}

module.exports.mulNumbers = function(req, res){
	var num1 = Number(req.body.num1);
	var num2 = Number(req.body.num2);

	response = {}
	statusCode = 200;
	response.message="The action was successful";

	if(typeof num1 == 'number' && typeof num2 == 'number'){
		response.result = num1*num2;
	} else {
		statusCode = 422;
		response.message = "The numbers you entered are not valid";
	}
	res.status(statusCode).send(JSON.stringify(response));
}

module.exports.divNumbers = function(req, res){
	var num1 = Number(req.body.num1);
	var num2 = Number(req.body.num2);

	response = {}
	statusCode = 200;
	response.message="The action was successful";

	if(typeof num1 == 'number' && typeof num2 == 'number'){
		if (num2 == 0) {
			statusCode = 422;
			response.message = "The numbers you entered are not valid";
		}
		else{
			//response.result = (num1/num2).toFixed(2);
			response.result = num1/num2;
		}
	} else {
		statusCode = 422;
		response.message = "The numbers you entered are not valid";
	}
	res.status(statusCode).send(JSON.stringify(response));
}






