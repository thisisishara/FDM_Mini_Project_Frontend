//-------------------------------------------------------------------------------------------------------------------------------
//CONNECTOR----------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------

//CONTENT PREPARATION
$(document).ready(function(){
	//handle history and page refresh issues
	window.onunload = function(){};
	
	//remove auth cookies
	if (Cookies.get('mdb-auth') != undefined){
		Cookies.remove('mdb-auth');
	}
	
	//set toast delay
    $('.toast').toast({
        //autohide: false,
        delay: 5000
    });
});

//TOAST
$(document).on("click", "#liveToastBtn", function (event) {
    $('.toast').toast('show');
});

$(document).on("click", "#signin", function (event) {
    var validationStatus = validateCredentials();
    if (validationStatus != true) {
       	buildToast("bg-danger", "Couldn't Sign in", validationStatus, "", "Media/error_red_sq.png")
        $('.toast').toast('show');
        return;
    }

    $.ajax(
        {
            url: "MDBHomeAPI",
            type: "POST",
            data: $("#loginform").serialize(),
            dataType: "text",
            xhrFields: {
    			withCredentials: true
			},
            complete: function (response, status) {
                onAuthenticationComplete(response.responseText, status);
            }
        });
});

function onAuthenticationComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);
        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            //test cookie val
			//alert(resultSet["USERDATA"].trim());
			
			buildToast("bg-success", "Authenticated.", "Signed in successfully. Redirecting...", "", "Media/check_green.png")
            $('.toast').toast('show');
	        
	        //set cookie [exp: 1day]
	        Cookies.remove('mdb-auth');
	        Cookies.set('mdb-auth', resultSet["USERDATA"].trim(), { expires: 1 });
	        
	        //redirect
	        var role = resultSet.ROLE.trim();
	        if(role == "ADMIN") {
	        	window.location.href = "AdminDashboard.jsp";
	        } else {
		       	window.location.href = "MovieLibrary.jsp";
	        }
        } else {
        	buildToast("bg-danger", "Couldn't Sign in", "Authentication Failed."+"\n"+resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png")
        	$('.toast').toast('show');
        }
    } else if (status == "error") {
        buildToast("bg-danger", "Couldn't Sign in", "Authentication Failed due to an unknown issue.", "", "Media/error_red_sq.png")
        $('.toast').toast('show');
    } else {
        buildToast("bg-danger", "Couldn't Sign in", "Failed to contact the server. Please try again later.", "", "Media/error_red_sq.png")
        $('.toast').toast('show');
    }
    $("#loginform")[0].reset();
}

//-------------------------------------------------------------------------------------------------------------------------------
//CLIENT-MODEL-------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------

function validateCredentials() {
    // email
    if ($("#email").val().trim() == "") {
        return "Email cannot be empty.";
    }
    
    var emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegEx.test($("#email").val().trim())) {
        return "Enter a valid email address.";
    }
    
    // password
    if ($("#password").val().trim() == "") {
        return "Password cannot be empty.";
    }
    return true;
}

function buildToast(bg, heading, body, time, icon) {
    $("#liveToastIcon").attr("src", icon);
    $("#liveToast").removeClass();
    $("#liveToast").addClass("toast hide text-white " + bg);
    $("#liveToastHeaderDiv").removeClass();
    $("#liveToastHeaderDiv").addClass("toast-header text-white " + bg);
    $("#liveToastTime").text(time);
    $("#liveToastHeading").text(heading);
    $("#liveToastBody").text(body);
}