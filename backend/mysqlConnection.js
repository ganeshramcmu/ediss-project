var mysql = require('../node_modules/mysql');

module.exports = {};

module.exports.createMysqlConnection = function()
{

	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : 'ediss1',
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