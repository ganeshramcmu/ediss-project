$(document).ready(function(){
  
  $("#loginButton").click(function(){

  	var username = $("#un").val();
  	var password = $("#pwd").val();

  	$.ajax({
  		method:"POST",
  		url:"/login",
  		data:{
  			user: {
  				username:username,
  				password:password
  			}
  		},
  		success:function(data, status){
  			dataObj = JSON.parse(data);
				//redirectUrl = dataObj.redirectUrl;
				redirectUrl = "/arith";
        window.location=redirectUrl;
  		},
  		error:function(err){
        resp = JSON.parse(err.responseText);
  			alert(resp.message);
  		}
  	});

  });

});