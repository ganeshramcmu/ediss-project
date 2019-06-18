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

module.exports.updateInfo = function(req, res){
	var input = req.body;

	response = {}
	statusCode = 200;
	response.message= req.session.userDetails.fname + " your information was successfully updated";

	updateQuery = "UPDATE UserProfile SET ";

	for (key in input){
		if ((input[key] !== null || input[key] !='') && input[key] != req.session.userDetails[key]) {
			req.session.userDetails[key] = input[key];
			updateQuery += "`"+ key + "`" + " = " + "'" + input[key] + "',";
		}
	}

	updateQuery = updateQuery.slice(0,-1);

	updateQuery += " WHERE `userid` = " + req.session.userDetails.userid;

	var connection = mysqlConnection.createMysqlConnection();

    if(!connection)
    {
      statusCode = 503;
      response.message = "The input you provided is not valid";
      res.status(statusCode).send(JSON.stringify(response));
    } else {
    	connection.query(updateQuery, function(err, rows, fields){

    	  if (err)
    	  {
    	    connection.end();
    	    statusCode = 500;
    	    response.message = "The input you provided is not valid";
    	  }
    	  res.status(statusCode).send(JSON.stringify(response));
    	});
    }
}

module.exports.addProduct = function(req, res){
	var input = req.body;

	response = {}
	statusCode = 200;
	response.message= input.productName + " was successfully added to the system";

	addProductQuery = "INSERT INTO products (asin, productName, productDescription, pgroup) VALUES (";

	for (key in input){
		if (input[key] !== null || input[key] !=='') {
			addProductQuery += "'" + input[key] + "', ";
		}
		else {
			statusCode = 422;
			response.message = "The input you provided is not valid";
		}
	}

	addProductQuery = addProductQuery.slice(0,-2);
	addProductQuery += ");"
	
	if (statusCode != 422) {
		
		var connection = mysqlConnection.createMysqlConnection();

		if(!connection)
		{
		  statusCode = 503;
		  response.message = "The input you provided is not valid";
		  res.status(statusCode).send(JSON.stringify(response));
		} else {
			connection.query(addProductQuery, function(err, rows, fields){

			  if (err)
			  {
			    if(err.errno == 1062)
			    {
			      statusCode = 400;
			      response.message = "The input you provided is not valid";
			    }
			    else
			    {
			      statusCode=500;
			      response.message="The input you provided is not valid";
			    }
			    statusCode = 500;
			    response.message = "The input you provided is not valid";
			  }
			  else {
			  	statusCode = 200;
			  	response.message= input.productName + " was successfully added to the system";
			  }

			  res.status(statusCode).send(JSON.stringify(response));
			});
		}
	} else {
		res.status(statusCode).send(JSON.stringify(response));
	}
}

module.exports.checkIfAdmin = function(req, res, next){
	var input = req.body;

	response = {}
	statusCode = 200;
	response.message= "Yes you are an admin";

	if (req.session.userDetails.username != "jadmin") {
		statusCode = 403;
		response.message= "You must be an admin to perform this action";
		res.status(statusCode).send(JSON.stringify(response));
	} else {
		next();
	}
}

module.exports.modifyProduct = function(req, res){
	var input = req.body;

	response = {}
	statusCode = 200;
	response.message= input.productName + " was successfully updated";

	updateQuery = "UPDATE products SET ";
	key1='pgroup';
	for (key in input){
		if (input[key] !== null || input[key] !='') {
			if (key != "asin") {
				if (key == 'group') {
					key1 = 'pgroup';
				}
				else {
					key1 = key;
				}
				updateQuery += "`"+ key1 + "`" + " = " + "'" + input[key] + "',";
			}
		}
		else {
			statusCode = 422;
			response.message = "The input you provided is not valid";
		}
	}

	updateQuery = updateQuery.slice(0,-1);

	updateQuery += " WHERE `asin` = " + input['asin']+";";

    if (statusCode!=422) {
    	
    	var connection = mysqlConnection.createMysqlConnection();

    	if(!connection)
    	{
    	  statusCode = 503;
    	  response.message = "The input you provided is not valid";
    	  res.status(statusCode).send(JSON.stringify(response));
    	} else {
    		connection.query(updateQuery, function(err, rows, fields){
    		  if (err)
    		  {
    		    connection.end();
    		    statusCode = 500;
    		    response.message = "The input you provided is not valid";
    		  }
    		  res.status(statusCode).send(JSON.stringify(response));
    		});
    	}
    } else {
    	res.status(statusCode).send(JSON.stringify(response));
    }
}

module.exports.viewUsers = function(req, res){
	input = req.body;
	response = {};
	statusCode = 200;

	viewUsersQuery = "SELECT * FROM UserProfile";

	if (input.fname !== null && input.fname !=='' && input.lname == null && input.lname =='') {
		viewUsersQuery = "SELECT * FROM UserProfile WHERE fname LIKE '%"+ input.fname + "%';";
	}
	else if (input.fname == null && input.fname =='' && input.lname !== null && input.lname !=='') {
		viewUsersQuery = "SELECT * FROM UserProfile WHERE lname LIKE '%"+ input.lname + "%';";
	}
	else if (input.fname !== null && input.fname !=='' && input.lname !== null && input.lname !=='') {
		viewUsersQuery = "SELECT * FROM UserProfile WHERE fname LIKE '%"+ input.fname + "%' OR lname LIKE '%" + input.lname +"%';";
	}

	var connection = mysqlConnection.createMysqlConnection();

	if(!connection)
	{
	  statusCode = 503;
	  response.message = "There are no users that match that criteria";
	  res.status(statusCode).send(JSON.stringify(response));
	} else {
		connection.query(viewUsersQuery, function(err, rows, fields){
		  
		  if (err)
		  {
		    connection.end();
		    statusCode = 500;
		    response.message = "There are no users that match that criteria";
		  }
		  else {
		  	if(rows.length <= 0)
		  	{
		  	  connection.end();
		  	  statusCode = 500;
		  	  response.message = "There are no users that match that criteria";
		  	}
		  	else {
		  		connection.end();
		  		statusCode = 200;
		  		response.message = "The action was successful"
		  		response.user = [];
		  		for (var i = 0; i < rows.length; i++) {
		  			var obj = {};
		  			obj.fname = rows[i].fname;
		  			obj.lname = rows[i].lname;
		  			obj.userId = rows[i].userid;
		  			response.user.push(obj);
		  		}
		  	}
		  }
		  res.status(statusCode).send(JSON.stringify(response));
		});
	}
}

module.exports.viewProducts = function(req, res){
	//no login or admin access required;
	input = req.body;
	response = {};
	statusCode = 200;

	viewUsersQuery = "SELECT * FROM products";

	asin = input.asin;
	keyword = input.keyword;
	group = input.group;

	if (!asin) {
		asin='';
	}
	if (!keyword) {
		keyword='';
	}
	if (!group) {
		group='';
	}

	viewUsersQuery = "SELECT * FROM products WHERE asin LIKE '%"+ asin +"%' AND pgroup LIKE '%"+group+ "%' AND (productName LIKE '%"+ keyword + "%' OR productDescription LIKE '%" + keyword +"%');";

	var connection = mysqlConnection.createMysqlConnection();
	
	if(!connection)
	{
	  statusCode = 503;
	  response.message = "There are no products that match that criteria";
	  res.status(statusCode).send(JSON.stringify(response));
	} else {
		connection.query(viewUsersQuery, function(err, rows, fields){
		  
		  if (err)
		  {
		    connection.end();
		    statusCode = 500;
		    response.message = "There are no products that match that criteria";
		  }
		  else {
		  	
		  	if(rows.length <= 0)
		  	{
		  	  connection.end();
		  	  statusCode = 500;
		  	  response.message = "There are no products that match that criteria";
		  	}
		  	else {
		  		connection.end();
		  		statusCode = 200;
		  		//response.message = "The action was successful"
		  		response.product = [];
		  		for (var i = 0; i < rows.length; i++) {
		  			console.log(rows[i]);
		  			var obj = {};
		  			obj.asin = rows[i].asin;
		  			obj.productName = rows[i].productName;
		  			response.product.push(obj);
		  		}
		  	}
		  }
		  res.status(statusCode).send(JSON.stringify(response));
		});
	}
}






