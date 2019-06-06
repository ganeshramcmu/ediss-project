$(document).ready(function(){
  
  $("#logoutButton").click(function(){

  	$.ajax({
  		method:"POST",
  		url:"/logout",
  		success:function(data, status){
				dataObj = JSON.parse(data);
        if (dataObj.statusCode==302) {
          redirectUrl = dataObj.redirectUrl;
          window.location=redirectUrl;
        }
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
        if (data.statusCode == 200) {
          $("#addition").text("The result is "+data.result);
        }
        else if(data.statusCode == 500){
          $("#addition").text(data.result);
        }
      },
      error:function(err){
        $("#addition").text(err);
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
        if (data.statusCode == 200) {
          $("#subtract").text("The result is "+data.result);
        }
        else if(data.statusCode == 500){
          $("#subtract").text(data.result);
        }
      },
      error:function(err){
        $("#subtract").text(err);
      }
    });
  });

  $("#mulno").click(function(){
    $.ajax({
      method:"post",
      url:"/mul",
      data:{
        num1: $("#num21").val(),
        num2: $("#num23").val()
      },
      success: function(data, status){
        data=JSON.parse(data);
        if (data.statusCode == 200) {
          $("#multi").text("The result is "+data.result);
        }
        else if(data.statusCode == 500){
          $("#multi").text(data.result);
        }
      },
      error:function(err){
        $("#multi").text(err);
      }
    });
  });

  $("#divno").click(function(){
    $.ajax({
      method:"post",
      url:"/div",
      data:{
        num1: $("#num31").val(),
        num2: $("#num32").val()
      },
      success: function(data, status){
        data=JSON.parse(data);
        if (data.statusCode == 200) {
          $("#division").text("The result is "+data.result);
        }
        else if(data.statusCode == 500){
          $("#division").text(data.result);
        }
      },
      error:function(err){
        $("#division").text(err);
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