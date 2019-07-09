var mysqlConnection = require('./mysqlConnection');

module.exports = {};

module.exports.getUserDetails = function(req, res){

	var response = {};
	response.statusCode = 200;
	response.userDetails = req.session.userDetails;
	res.status(200).send(JSON.stringify(response));
	
};

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

module.exports.purchaseProducts = function(req, res){
	//login required;
	input = req.body;
	response = {};
	statusCode = 200;
	var connection = mysqlConnection.createMysqlConnection();
	
	if(!connection)
	{
	  statusCode = 503;
	  response.message = "There are no products that match that criteria";
	  res.status(statusCode).send(JSON.stringify(response));
	} else {
		var inputLength = input.products.length;
		asinCSV='';
		asinList=[];
		if (inputLength) {
			for (var i = 0; i < inputLength; i++) {
				asinList[i]= input.products[i].asin;
			}
			asinCSV=asinList.join(',');

			// Start the transaction
			connection.beginTransaction(function(err){
				if (err) {
					console.log(err);
					connection.end();
					statusCode = 500;
					response.message = "There are no products that match that criteria";
					res.status(statusCode).send(JSON.stringify(response));
				} else {
					q1= "SELECT COUNT(*) FROM products WHERE asin in ("+asinCSV+");";
					connection.query(q1, function(err, rows, fields){
						if (err) {
						  statusCode = 500;
						  response.message = "There are no products that match that criteria";
						  res.status(statusCode).send(JSON.stringify(response));
						  return connection.rollback(function() {
						    connection.end();
						  });
						}
						else {
							if(rows.length <= 0)
							{
							  statusCode = 500;
							  response.message = "There are no products that match that criteria";
							  res.status(statusCode).send(JSON.stringify(response));
							  return connection.rollback(function() {
							    connection.end();
							  });
							} else {
								if (rows[0].count) {
									// proceed with creating a new order
									q2 = "INSERT INTO Orders (userid) VALUES ("+ req.session.userDetails.userid + ");";
									connection.query(q2, function(err, rows, fields){
										if (err)
										{
										  statusCode = 500;
										  response.message = "There are no products that match that criteria";
										  res.status(statusCode).send(JSON.stringify(response));
										  return connection.rollback(function() {
										    connection.end();
										  });
										} else {
											if(rows.length <= 0)
											{
											  statusCode = 500;
											  response.message = "There are no products that match that criteria";
											  res.status(statusCode).send(JSON.stringify(response));
											  return connection.rollback(function() {
											    connection.end();
											  });
											} else {
												orderid = rows[0].insertId;
												// insert products and order into product order map table
												q3 = "INSERT INTO ProductOrderMap (orderid, asin) VALUES ?";
												values = [];
												for (var i = 0; i < asinList.length; i++) {
													values[i] = [orderid, asinList[i]];
												}
												connection.query(q3, [values], function(err, rows, fields){
													if (err) {
														throw err;
													} else {
														if (rows.changedRows == 0) {
															statusCode = 500;
															response.message = "There are no products that match that criteria";
															res.status(statusCode).send(JSON.stringify(response));
															return connection.rollback(function() {
															  connection.end();
															});
														} else {
															connection.end();
															statusCode = 200;
															response.message = "The action was successful";
															connection.commit(function(err) {
														        if (err) {
														          return connection.rollback();
														        }
														        //prepare recommendations
														        prepareRecommendations(input.body.products);
														        res.status(statusCode).send(JSON.stringify(response));
														    });
														}
													}
													res.status(statusCode).send(JSON.stringify(response));
												});
											}
										}
									});
								} else {
									//end transaction
									statusCode = 500;
									response.message = "There are no products that match that criteria";
									res.status(statusCode).send(JSON.stringify(response));
									return connection.rollback(function() {
									  connection.end();
									});
								}
							}
						}
					});
				}
			});
		} else {
			statusCode = 503;
			response.message = "There are no products that match that criteria";
			res.status(statusCode).send(JSON.stringify(response));
		}
	}
}

prepareRecommendations = function(products){
	console.log("Handle Together-Purchase")
	var connection = mysqlConnection.createMysqlConnection();
	
	if(!connection)
	{
	  statusCode = 503;
	  response.message = "There are no products that match that criteria";
	  res.status(statusCode).send(JSON.stringify(response));
	} else {
		for(var i = 0; i < products.length; i++) {
		    const asin = products[i].asin;
		    console.log(asin);
		    for(var j = 0; j < products.length; j++) {
		        const productId = products[j].asin;
		        console.log(productId);
		        if(asin.localeCompare(productId) == 0) {
		            console.log("Same Product Match")
		            continue;
		        }
		        else {
		            console.log("Different Product")
		            connection.query("SELECT * FROM recommendations WHERE asin = ? AND productId = ?", [asin, productId], function(err, rows, fields) {
		                if(err) {
		                    console.log("Database Error")
		                }
		                else if(rows.length == 0) {
		                    var together_index = 1
		                    connection.query("INSERT INTO recommendations(asin, productId, together_index) VALUES (?, ?, ?)", [asin, productId, together_index], function(err, rows, fields) {
		                        if(err) {
		                            console.log("Database Error!")
		                        }
		                        else {
		                            console.log("Recommendations Entry Added!")
		                        }
		                    });
		                }
		                else {
		                    const new_together_index = rows[0].together_index + 1;
		                    connections.query("UPDATE recommendations SET together_index = ? WHERE asin = ? AND productId = ?", [new_together_index, asin, productId], function(err, rows, fields) {
		                        if(err) {
		                            console.log("Database Error :(");
		                        }
		                        else {
		                            console.log("Recommendation Updated")
		                        }
		                    });
		                }
		            });
		        }
		    }
		}
	}
}

module.exports.productsPurchased = function(req, res){
	// admin access required

	var username=req.body.username;
	response={};
	statusCode=200;
	var connection = mysqlConnection.createMysqlConnection();
	
	if(!connection)
	{
	  statusCode = 503;
	  response.message = "There are no products that match that criteria";
	  res.status(statusCode).send(JSON.stringify(response));
	} else {
		checkUserQuery = "SELECT userid FROM UserProfile WHERE username='"+username+"';";
		connection.query(checkUserQuery, function(err, rows, fields){
			if (err) {
			  statusCode = 500;
			  response.message = "There are no users that match that criteria";
			  res.status(statusCode).send(JSON.stringify(response));
			} else {
				if (rows.length <=0) {
					statusCode = 500;
					response.message = "There are no users that match that criteria";
					res.status(statusCode).send(JSON.stringify(response));
				} else {
					userid = rows[0].userid;
					retreiveItemsQuery = "SELECT p.productName as productName, COUNT(*) as quantity FROM ProductOrderMap AS pm INNER JOIN Orders AS o ON pm.orderid=o.orderid INNER JOIN products AS p ON pm.asin=p.asin WHERE o.userid="+userid+" GROUP BY pm.asin;"
					connection.query(retreiveItemsQuery, function(err, rows, fields){
						if (err) {
						  statusCode = 500;
						  response.message = "There are no users that match that criteria";
						} else {
							if (rows.length <=0) {
								statusCode = 500;
								response.message = "There are no users that match that criteria";
							} else {
								statusCode=200;
								response.products=rows;
								response.message="The action was successful";
							}
						}
						res.status(statusCode).send(JSON.stringify(response));
					});
				}
			}
		});
	}
}

module.exports.getRecommendations = function(req, res){
	console.log("Handle Product Recommendations")

    var asin = req.body.asin
    console.log(asin);
	response={};
	statusCode=200;
	var connection = mysqlConnection.createMysqlConnection();
	
	if(!connection)
	{
	  statusCode = 503;
	  response.message = "There are no products that match that criteria";
	  res.status(statusCode).send(JSON.stringify(response));
	} else {
		connection.query("SELECT productId FROM recommendations WHERE asin = ? ORDER BY together_index DESC LIMIT 5", [asin], function(err, rows, fields) {
		    if(err) {
		        console.log("Database Error!");
		        statusCode=500;
		        response.message = "There are no recommendations for that product";
		        res.status(statusCode).send(JSON.stringify(response));
		    }
		    else if(results.length == 0) {
		        console.log("No together_index");
		        statusCode=500;
		        response.message= "There are no recommendations for that product";
		        res.status(statusCode).send(JSON.stringify(response));
		    }
		    else {
		        console.log("Yes together_index");
		        statusCode=500;
		        response.message= "The action was successful";
		        response.products= rows;
		        res.status(statusCode).send(JSON.stringify(response));
		    }
		});
	}
}



