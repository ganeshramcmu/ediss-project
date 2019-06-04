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
    module.exports.destroySession(req.session);
    res.status(401).end("UnAuthorized");
  }
};

module.exports.logout = function(req, res, next)
{
  module.exports.destroySession(req.session);
  res.status(200);
  response = {};
  response.statusCode = 302;
  response.redirectUrl = SERVER_URI_PREFIX + "/#/login";
  res.send(JSON.stringify(response));
};

module.exports.login = function(req, res, returnCode)
{
  user = req.body.user;
  var userid = user.userid;
  var password = user.pwd;
  var authQuery = "SELECT userid, password FROM edissDB.UserProfile WHERE userid = " + "'" + userid + "';";

  var connection = mysqlConnection.createMysqlConnection();
  response = {};
  if(!connection)
  {
    response.statusCode = 503;
    response.message = "Database is down";
    returnCode(503,JSON.stringify(response));
  }

  connection.query(authQuery, function(err,rows,fields)
  {

    if(err)
    {
      connection.end();
      module.exports.destroySession(req.session, user);
      response.statusCode = 500;
      response.message = "Try again";
      returnCode(500,JSON.stringify(response));
    }
    else
    {
      if(rows.length <= 0)
      {
        connection.end();
        module.exports.destroySession(req.session, user);
        response.statusCode = 400;
        response.message = "User Not Registered";
        returnCode(400,JSON.stringify(response));
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
              response.statusCode = 500;
              response.message = "Try again";
              returnCode(500,JSON.stringify(response));
            }
            else
            {
              connection.end();
              delete rows[0].password;
              req.session.userDetails = rows[0];
              response.statusCode = 302;
              response.message = "Success";
              response.redirectUrl = SERVER_URI_PREFIX + "/arith";
              response.userDetails = rows[0];

              returnCode(200, JSON.stringify(response));
            }
          });

        }
        else
        {
          connection.end();
          module.exports.destroySession(req.session, user);
          response.statusCode = 400;
          response.message = "Incorrect Credentials";
          returnCode(400,JSON.stringify(response));
        }
      }
    }
  });
};