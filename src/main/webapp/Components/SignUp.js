//-------------------------------------------------------------------------------------------------------------------------------
//CONNECTOR----------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------

//CONTENT PREPARATION
$(document).ready(function () {
    //handle history and page refresh issues
    window.onunload = function () { };

    //remove auth cookies
    if (Cookies.get('mdb-auth') != undefined) {
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

//SUBMIT CONSUMER FORM
$(document).on("click", "#usersignup", function (event) {
    //hide alerts
    //$('.toast').toast('hide');

    //form validation
    var validationStatus = validateUserForm();
    if (validationStatus != true) {
        buildToast("bg-danger", "Error Creating the Account", validationStatus, "", "Media/error_red_sq.png");
        $('.toast').toast('show');
        return;
    }

    $.ajax(
        {
            url: "MDBHomeAPI",
            type: "POST",
            data: $("#userform").serialize(),
            dataType: "text",
            complete: function (response, status) {
                onConsumerSaveComplete(response.responseText, status);
            }
        });
});

//POST-CONSUMER RESPONSE HANDLING
function onConsumerSaveComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Signing up completed.", "Account created successfully. Please sign in to start using your new account.", "", "Media/check_green.png");
            $('.toast').toast('show');
        } else {
            buildToast("bg-danger", "Error Occurred", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
            $('.toast').toast('show');
        }
    } else if (status == "error") {
        buildToast("bg-danger", "Couldn't Create the Account", "Error occurred while saving the account details.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    } else {
        buildToast("bg-danger", "Couldn't Create the Account", "Unknown Error occurred while creating the account.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    }
    $("#userform")[0].reset();
}

//-------------------------------------------------------------------------------------------------------------------------------
//CLIENT-MODEL-------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------

function validateUserForm() {
    //VALIDATIONS
    if ($("#useremail").val().trim() == "") {
        return "Email address cannot be empty.";
    }

    var emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegEx.test($("#useremail").val().trim())) {
        return "Enter a valid email address.";
    }

    if ($("#userpassword").val().trim() == "") {
        return "Password cannot be empty.";
    }

    if ($("#userfirstname").val().trim() == "") {
        return "First name cannot be empty.";
    }

    if ($("#userlastname").val().trim() == "") {
        return "Last name cannot be empty.";
    }

    if ($("#usergender").val().trim() == "Gender") {
        return "Gender cannot be empty.";
    }
    return true;
}

function buildToast(bg, heading, body, time, icon) {
    $("#liveToast").removeClass();
    $("#liveToast").addClass("toast hide text-white " + bg);
    $("#liveToastHeaderDiv").removeClass();
    $("#liveToastHeaderDiv").addClass("toast-header text-white " + bg);
    $("#liveToastIcon").attr("src", icon);
    $("#liveToastTime").text(time);
    $("#liveToastHeading").text(heading);
    $("#liveToastBody").text(body);
}