var mysql = require('../node_modules/mysql');
var globals = require('../globals.js');

module.exports = {};

module.exports.createMysqlConnection = function()
{
	user_password = "edissproject";
	if (!globals.testing) {
		user_password = "EdissProject123$";
	}

	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'ediss',
		password : user_password,
		database : 'edissDB'
	});

	connection.connect(
		function(err)
		{
		  if(err)
		  {
		    return false;
		  }
		}
	);

	return connection;

};