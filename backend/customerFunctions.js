var mysqlConnection = require('./mysqlConnection');

module.exports = {};

module.exports.getUserDetails = function(req, res){

	var response = {};
	response.statusCode = 200;
	response.userDetails = req.session.userDetails;
	res.status(200).send(JSON.stringify(response));
	
};

module.exports.addNumbers = function(req, res){
	
	var number1 = Number(req.body.number1);
	var number2 = Number(req.body.number2);

	response = {}
	response.statusCode = 200;

	if(typeof number1 == 'number' && typeof number2 == 'number'){
		response.result = number1 + number2;
	} else {
		response.statusCode = 500;
		response.result = "Please enter numbers only";
	}
	res.status(200).send(JSON.stringify(response));
}

module.exports.subNumbers = function(req, res){
	var number1 = Number(req.body.number1);
	var number2 = Number(req.body.number2);

	response = {}
	response.statusCode = 200;

	if(typeof number1 == 'number' && typeof number2 == 'number'){
		response.result = number1 - number2;
	} else {
		response.statusCode = 500;
		response.result = "Please enter numbers only";
	}
	res.status(200).send(JSON.stringify(response));
}

module.exports.mulNumbers = function(req, res){
	var number1 = Number(req.body.number1);
	var number2 = Number(req.body.number2);

	response = {}
	response.statusCode = 200;

	if(typeof number1 == 'number' && typeof number2 == 'number'){
		response.result = number1*number2;
	} else {
		response.statusCode = 500;
		response.result = "Please enter numbers only";
	}
	res.status(200).send(JSON.stringify(response));
}

module.exports.divNumbers = function(req, res){
	var number1 = Number(req.body.number1);
	var number2 = Number(req.body.number2);

	response = {}
	response.statusCode = 200;

	if(typeof number1 == 'number' && typeof number2 == 'number'){
		if (number2 == 0) {
			response.statusCode = 500;
			response.result = "The denominator can't be zero";
		}
		else{
			response.result = (number1/number2).toFixed(2);
		}
	} else {
		response.statusCode = 500;
		response.result = "Please enter numbers only";
	}
	res.status(200).send(JSON.stringify(response));
}






