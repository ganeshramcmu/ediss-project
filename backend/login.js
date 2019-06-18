//Handles login functionality
var mysqlConnection = require('./mysqlConnection.js');

module.exports = {};

module.exports.destroySession = function(session, user)
{
  if (user === undefined)
  {
    user = {};
  }
  session.destroy(function(err){
    if (err) {
      console.log('Failed to destroy session for '+ JSON.stringify(user));
    }
  });
};

module.exports.checkSession = function(req, res, next)
{
  if (req.session.userDetails)
  {
    /*
      Implies that the user's session is still active and he is logged in.
      Call the next function to execute. Do not end the req res cycle.
    */
    next();
  }
  else
  {
    /*
      Implies that the session no more exists and the user has to login again.
      Destroy the session initialized in server.js.
      End the req res cycle with a 401 response status.
    */
    response = {}
    statusCode = 401;
    response.message="You are not currently logged in";
    module.exports.destroySession(req.session);
    res.status(statusCode).end(JSON.stringify(response));
  }
};

module.exports.logout = function(req, res, next)
{
  response = {};
  if (req.session.userDetails) {
  module.exports.destroySession(req.session);
  res.status(200);
  //response.statusCode = 302;
  //response.redirectUrl = SERVER_URI_PREFIX;
  response.message="You have been successfully logged out";
  } else{
   res.status(401);
   response.message="You are not currently logged in";
  }
  res.send(JSON.stringify(response));
};

module.exports.registerUser = function(req, res)
{
  var fname = req.body.fname;
  var lname = req.body.lname;
  var address = req.body.address;
  var city = req.body.city;
  var state = req.body.state;
  var zip = req.body.zip;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var input = req.body;
  response = {}

  statusCode = 200;
  response.message = fname + " was registered successfully";

  for (key in input){
    if ((input[key] == null || input[key] =='')) {
      statusCode = 422;
      response.message = "The input you provided is not valid";
    }
  }

  if (statusCode != 422) {

    var connection = mysqlConnection.createMysqlConnection();

    if(!connection)
    {
      statusCode = 503;
      response.message = "The input you provided is not valid";
    } else {
      var sqlQuery = "INSERT INTO edissDB.UserProfile (fname, lname, address, city, state, zip, email, username, password) VALUES('" + fname + "','"+ lname + "','" + address + "','"+ city + "','" + state + "','"+ zip + "','" + email + "','"+ username + "','" + password +"')";
      connection.query(sqlQuery, function(err,rows,fields){
        connection.end();
        if(err){
          if(err.errno == 1062){
            statusCode = 400;
            response.message = "The input you provided is not valid";
          }
          else{
            statusCode=500;
            response.message="The input you provided is not valid";
          }
        }
        else {
          statusCode=200;
          response.message = fname + " was registered successfully";
        }
      });
    }
  }

  res.status(statusCode).send(JSON.stringify(response));
}

module.exports.login = function(req, res, returnCode)
{
  user = req.body;
  var username = user.username;
  var password = user.password;
  var authQuery = "SELECT * FROM edissDB.UserProfile WHERE username = " + "'" + username + "';";
  var statusCode=200;
  var connection = mysqlConnection.createMysqlConnection();
  response = {};
  if(!connection)
  {
    statusCode = 503;
    response.message = "There seems to be an issue with the username/password combination that you entered";
    returnCode(statusCode,JSON.stringify(response));
  }

  connection.query(authQuery, function(err,rows,fields)
  {

    if(err)
    {
      connection.end();
      module.exports.destroySession(req.session, user);
      statusCode = 500;
      response.message = "There seems to be an issue with the username/password combination that you entered";
      returnCode(statusCode,JSON.stringify(response));
    }
    else
    {
      if(rows.length <= 0)
      {
        connection.end();
        module.exports.destroySession(req.session, user);
        statusCode = 400;
        response.message = "There seems to be an issue with the username/password combination that you entered";
        returnCode(statusCode,JSON.stringify(response));
      }
      else
      { 
        if(rows[0].password === password)
        {
          //retrieve user's data from db and set user's session

          var userDataQuery = "SELECT * FROM UserProfile WHERE userid = " + rows[0].userid;
          connection.query(userDataQuery, function(err, rows, fields){

            if (err)
            {
              connection.end();
              module.exports.destroySession(req.session, user);
              statusCode = 500;
              response.message = "There seems to be an issue with the username/password combination that you entered";
              returnCode(statusCode,JSON.stringify(response));
            }
            else
            {
              connection.end();
              delete rows[0].password;
              req.session.userDetails = rows[0];
              statusCode = 200;
              response.message = "Welcome "+rows[0].fname;
              //response.redirectUrl = SERVER_URI_PREFIX + "/arith";
              //response.userDetails = rows[0];

              returnCode(statusCode, JSON.stringify(response));
            }
          });

        }
        else
        {
          connection.end();
          module.exports.destroySession(req.session, user);
          statusCode = 400;
          response.message = "There seems to be an issue with the username/password combination that you entered";
          returnCode(statusCode,JSON.stringify(response));
        }
      }
    }
  });
};
