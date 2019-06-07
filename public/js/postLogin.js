$(document).ready(function(){
  
  $("#logoutButton").click(function(){

  	$.ajax({
  		method:"POST",
  		url:"/logout",
  		success:function(data, status){
				dataObj = JSON.parse(data);
        //redirectUrl = dataObj.redirectUrl;
        redirectUrl = "/";
        window.location=redirectUrl;
  		},
  		error:function(err){
  			//console.log(err);
  		}
  	});

  });

  function getUserDetails(){
    $.ajax({
      method:'get',
      url:'/getUserDetails',
      success:function(data, status){
        dataObj = JSON.parse(data);
        if (dataObj.statusCode==200) {
          $("#welcome").append('<b> '+ dataObj.userDetails.fullName +'!</b>');
        }
      },
      error:function(err){

      }
    });
  }

  getUserDetails();

  $("#addno").click(function(){
    $.ajax({
      method:"post",
      url:"/add",
      data:{
        num1: $("#num1").val(),
        num2: $("#num2").val()
      },
      success: function(data, status){
        data=JSON.parse(data);
        $("#addition").text(data.message+"."+" The result is "+data.result);
      },
      error:function(err){
        data = JSON.parse(err.responseText);
        $("#division").text(data.message);
      }
    });
  });

  $("#subno").click(function(){
    $.ajax({
      method:"post",
      url:"/sub",
      data:{
        num1: $("#num11").val(),
        num2: $("#num22").val()
      },
      success: function(data, status){
        data=JSON.parse(data);
        $("#subtract").text(data.message+"."+" The result is "+data.result);
      },
      error:function(err){
        data = JSON.parse(err.responseText);
        $("#division").text(data.message);
      }
    });
  });

  $("#mulno").click(function(){
    $.ajax({
      method:"post",
      url:"/multiply",
      data:{
        num1: $("#num21").val(),
        num2: $("#num23").val()
      },
      success: function(data, status){
        data=JSON.parse(data);
        $("#multi").text(data.message+"."+" The result is "+data.result);
      },
      error:function(err){
        data = JSON.parse(err.responseText);
        $("#division").text(data.message);
      }
    });
  });

  $("#divno").click(function(){
    $.ajax({
      method:"post",
      url:"/divide",
      data:{
        num1: $("#num31").val(),
        num2: $("#num32").val()
      },
      success: function(data, status){
        data=JSON.parse(data);
        $("#division").text(data.message+"."+" The result is "+data.result);
      },
      error:function(err){
        data = JSON.parse(err.responseText);
        $("#division").text(data.message);
      }
    });
  });
});

$(document).ajaxError(function(event, jqxhr, settings, thrownError) {
  data = JSON.parse(jqxhr.responseText);
  if (data.message=="You are not currently logged in") {
    window.location="/";
  }
});