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
			if (dataObj.statusCode==302) {
				redirectUrl = dataObj.redirectUrl;
				window.location=redirectUrl;
			}
  		},
  		error:function(err){
  			alert("There was some error. Try again");
  		}
  	});

  });

});