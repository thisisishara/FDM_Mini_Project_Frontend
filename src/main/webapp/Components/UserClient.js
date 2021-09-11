//CLIENT COMPONENTS

//-----------------------------------------------------------------------------------------------------------------------------
//CONNECTOR--------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//CHECK AUTH COOKIE ON PAGE LOAD
//SET CONTENT VISIBILITY
$(document).ready(function () {
    //handle history and page refresh issues
    window.onunload = function () { };

    var AuthCookie = Cookies.get('mdb-auth');

    //check cookie at first
    if (AuthCookie == undefined) {
        window.location.href = "Home.jsp";
    }

    $(".sidebarpage").hide();
    loadAdminDBContents();
    loadUserAccountDetails();

    //set toast delay
    $('.toast').toast({
        //autohide: false,
        delay: 5000
    });
});

//SETTING SIDEBAR ACTIVE LINK
$(document).on("click", ".nav-link", function (event) {
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
    $(".sidebarpage").hide();

    var activeSidebarItem = $(this).find(".admindashboardlink").text();

    if (activeSidebarItem == "Dashboard") {
        isAuthenticated();
        loadAdminDBContents();
    } else if (activeSidebarItem == "User Management") {
        isAuthenticated();
        loadAdminUMContents();
    } else if (activeSidebarItem == "Account Security") {
        isAuthenticated();
        loadAdminASContents();
    } else if (activeSidebarItem == "Profile Settings") {
        isAuthenticated();
        loadAdminPSContents();
    }
});

//LOAD CONTENTS ON SIDEBAR LINK CLICK
function loadAdminDBContents() {
    $("#admindashboard").fadeIn();
}

function loadAdminUMContents() {
    $("#adminusermgmt").fadeIn();
}

function loadAdminASContents() {
    $("#adminaccsec").fadeIn();
    loadAccountList();
}

function loadAdminPSContents() {
    $("#adminprofsett").fadeIn();
}

//LOAD ACCOUNT LIST TO ACCOUNT SECURITY PAGE FROM AccountsAPI DC BUS
function loadAccountList() {
    $.ajax(
        {
            url: "AccountsAPI",
            type: "GET",
            dataType: "text",
            complete: function (response, status) {
                onLoadALComplete(response.responseText, status);
            }
        });
}

//ACCOUNT TABLE LOAD RESPONSE HANDLING
function onLoadALComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        $("#accountsGrid").html(resultSet.ACC);
    } else {
        $("#accountsGrid").html("Couldn't retrieve the list of accounts.");
    }
}

//LOAD USER ACCOUNT DETAILS FROM UserClientAPI DC BUS
function loadUserAccountDetails() {
    $.ajax(
        {
            url: "UserClientAPI",
            type: "GET",
            dataType: "text",
            complete: function (response, status) {
                onLoadUADComplete(response.responseText, status);
            }
        });
}

//USER TABLE LOAD RESPONSE HANDLING
function onLoadUADComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        $("#researcherAccountsGrid").html(resultSet.RES);
        $("#funderAccountsGrid").html(resultSet.FUN);
        $("#consumerAccountsGrid").html(resultSet.CON);
        $("#employeeAccountsGrid").html(resultSet.EMP);
    } else {
        $("#researcherAccountsGrid").html("Couldn't retrieve the list of researchers.");
        $("#funderAccountsGrid").html("Couldn't retrieve the list of funders.");
        $("#consumerAccountsGrid").html("Couldn't retrieve the list of consumers.");
        $("#employeeAccountsGrid").html("Couldn't retrieve the list of employees.");
    }
}

//TOAST TEST EVENT HANDLER
$(document).on("click", "#liveToastBtn", function (event) {
    $('.toast').toast('show');
});

//DASHBOARD PAGE LINKS EVENT HANDLING
//Clicks relevent sidebar link on button clicks
$(document).on("click", "#userdash", function (event) {
	$( ".nav-link span:contains('User Management')" ).click();
});

$(document).on("click", "#securitydash", function (event) {
	$( ".nav-link span:contains('Account Security')" ).click();
});

$(document).on("click", "#profiledash", function (event) {
	$( ".nav-link span:contains('Profile Settings')" ).click();
});

//POST METHODS DC ENGINES TO Communicate wuth UserClientAPI DC BUS
//HANDLING FORM SUBMISSIONS
//SUBMIT CONSUMER FORM
$(document).on("click", "#consumersignup", function (event) {
    //form validation
    var validationStatus = validateConsumerForm();
    if (validationStatus != true) {
        buildToast("bg-danger", "Couldn't Create the Account", validationStatus, "", "Media/error_red_sq.png");
        $('.toast').toast('show');
        return;
    }

    if ($("#consumerisupdate").val().trim() == "false") {
        $.ajax(
            {
                url: "UserClientAPI",
                type: "POST",
                data: $("#consumerform").serialize(),
                dataType: "text",
                complete: function (response, status) {
                    onConsumerSaveComplete(response.responseText, status);
                }
            });
    } else {
        $.ajax(
            {
                url: "UserClientAPI",
                type: "PUT",
                data: $("#consumerform").serialize(),
                dataType: "text",
                complete: function (response, status) {
                    onConsumerUpdateComplete(response.responseText, status);
                }
            });
    }
});

//POST-CONSUMER FORM SUBMISSION RESPONSE HANDLING
function onConsumerSaveComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Account Created.", "Account created successfully. Find it in the list of accounts", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#consumerAccountsGrid").html(resultSet.CON);
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
    $("#consumerform")[0].reset();
}

//PUT-CONSUMER RESPONSE HANDLING
function onConsumerUpdateComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Account Updated.", "Account details updated successfully. Find it in the list of accounts.", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#consumerAccountsGrid").html(resultSet.CON);
        } else {
            buildToast("bg-danger", "Error Occurred", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
            $('.toast').toast('show');
        }
    } else if (status == "error") {
        buildToast("bg-danger", "Couldn't Updated the Account", "Error occurred while saving the new account details.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    } else {
        buildToast("bg-danger", "Couldn't Updated the Account", "Unknown Error occurred while updating the account.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    }
    $("#consumercancelupdate").click();
}

//SUBMIT FUNDER FORM
$(document).on("click", "#fundersignup", function (event) {
    //form validation
    var validationStatus = validateFunderForm();
    if (validationStatus != true) {
        buildToast("bg-danger", "Couldn't Create the Account", validationStatus, "", "Media/error_red_sq.png");
        $('.toast').toast('show');
        return;
    }

    if ($("#funderisupdate").val().trim() == "false") {
        $.ajax(
            {
                url: "UserClientAPI",
                type: "POST",
                data: $("#funderform").serialize(),
                dataType: "text",
                complete: function (response, status) {
                    onFunderSaveComplete(response.responseText, status);
                }
            });
    } else {
        $.ajax(
            {
                url: "UserClientAPI",
                type: "PUT",
                data: $("#funderform").serialize(),
                dataType: "text",
                complete: function (response, status) {
                    onFunderUpdateComplete(response.responseText, status);
                }
            });
    }
});

//POST-FUNDER RESPONSE HANDLING
function onFunderSaveComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Account Created.", "Account created successfully. Find it in the list of accounts.", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#funderAccountsGrid").html(resultSet.FUN);
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
    $("#funderform")[0].reset();
}

//PUT-FUNDER RESPONSE HANDLING
function onFunderUpdateComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);
        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Account Updated.", "Account details updated successfully. Find it in the list of accounts.", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#funderAccountsGrid").html(resultSet.FUN);
        } else {
            buildToast("bg-danger", "Error Occurred", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
            $('.toast').toast('show');
        }
    } else if (status == "error") {
        buildToast("bg-danger", "Couldn't Update the Account", "Error occurred while saving the new account details.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    } else {
        buildToast("bg-danger", "Couldn't Update the Account", "Unknown Error occurred while updating the account.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    }
    $("#fundercancelupdate").click();
}

//SUBMIT RESEARCHER FORM
$(document).on("click", "#researchersignup", function (event) {
    //form validation
    var validationStatus = validateResearcherForm();
    if (validationStatus != true) {
        buildToast("bg-danger", "Couldn't Create the Account", validationStatus, "", "Media/error_red_sq.png");
        $('.toast').toast('show');
        return;
    }

    if ($("#researcherisupdate").val().trim() == "false") {
        $.ajax(
            {
                url: "UserClientAPI",
                type: "POST",
                data: $("#researcherform").serialize(),
                dataType: "text",
                complete: function (response, status) {
                    onResearcherSaveComplete(response.responseText, status);
                }
            });
    } else {
        $.ajax(
            {
                url: "UserClientAPI",
                type: "PUT",
                data: $("#researcherform").serialize(),
                dataType: "text",
                complete: function (response, status) {
                    onResearcherUpdateComplete(response.responseText, status);
                }
            });
    }
});

//POST-RESEARCHER RESPONSE HANDLING
function onResearcherSaveComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Account Created.", "Account created successfully. Find it in the list of accounts.", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#researcherAccountsGrid").html(resultSet.RES);
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
    $("#researcherform")[0].reset();
}

//PUT-RESEARCHER RESPONSE HANDLING
function onResearcherUpdateComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Account Updated.", "Account details updated successfully. Find it in the list of accounts.", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#researcherAccountsGrid").html(resultSet.RES);
        } else {
            buildToast("bg-danger", "Error Occurred", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
            $('.toast').toast('show');
        }
    } else if (status == "error") {
        buildToast("bg-danger", "Couldn't Update the Account", "Error occurred while saving the new account details.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    } else {
        buildToast("bg-danger", "Couldn't Update the Account", "Unknown Error occurred while updating the account.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    }
    $("#researchercancelupdate").click();
}

//SUBMIT EMPLOYEE FORM
$(document).on("click", "#employeesignup", function (event) {
    //form validation
    var validationStatus = validateEmployeeForm();
    if (validationStatus != true) {
        buildToast("bg-danger", "Couldn't Create the Account", validationStatus, "", "Media/error_red_sq.png");
        $('.toast').toast('show');
        return;
    }

    if ($("#employeeisupdate").val().trim() == "false") {
        $.ajax(
            {
                url: "UserClientAPI",
                type: "POST",
                data: $("#employeeform").serialize(),
                dataType: "text",
                complete: function (response, status) {
                    onEmployeeSaveComplete(response.responseText, status);
                }
            });
    } else {
        $.ajax(
            {
                url: "UserClientAPI",
                type: "PUT",
                data: $("#employeeform").serialize(),
                dataType: "text",
                complete: function (response, status) {
                    onEmployeeUpdateComplete(response.responseText, status);
                }
            });
    }
});

//POST-EMPLOYEE RESPONSE HANDLING
function onEmployeeSaveComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);
        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Account Created.", "Account created successfully. Find it in the list of accounts.", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#employeeAccountsGrid").html(resultSet.EMP);
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
    $("#employeeform")[0].reset();
}

//PUT-EMPLOYEE RESPONSE HANDLING
function onEmployeeUpdateComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);
        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Account Updated.", "Account details updated successfully. Find it in the list of accounts.", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#employeeAccountsGrid").html(resultSet.EMP);
        } else {
            buildToast("bg-danger", "Error Occurred", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
            $('.toast').toast('show');
        }
    } else if (status == "error") {
        buildToast("bg-danger", "Couldn't Update the Account", "Error occurred while saving the new account details.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    } else {
        buildToast("bg-danger", "Couldn't Update the Account", "Unknown Error occurred while updating the account.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    }
    $("#employeecancelupdate").click();
}

//HANDLING USER UPDATE BUTTON CLICK EVENTS
//UPDATE RESEARCHER
$(document).on("click", "#researcherupdate", function (event) {
    //populate the form
    $("#researcherisupdate").val($(this).data("researcherid"));
    $("#researcherusername").val($(this).data("resun"));
    $("#researcherpassword").val($(this).data("respw"));
    $("#researcherconfpassword").val($(this).data("respw"));
    $("#researcherfirstname").val($(this).closest("tr").find('td:eq(1)').text());
    $("#researchersecondname").val($(this).closest("tr").find('td:eq(2)').text());
    var gender = $(this).closest("tr").find('td:eq(3)').text();
    $("#researchergender").val(gender == "M" ? "Male" : (gender == "F" ? "Female" : "Other"));
    $("#researcheremail").val($(this).closest("tr").find('td:eq(4)').text());
    $("#researcherphone").val($(this).closest("tr").find('td:eq(5)').text());
    $("#researcherinstitute").val($(this).closest("tr").find('td:eq(6)').text());
    $("#researcheryoe").val($(this).closest("tr").find('td:eq(8)').text());
    $("#researchersignup").text("Update Account");
    $("#researchercancelupdate").removeClass("invisible");
    var resfos = $(this).closest("tr").find('td:eq(7)').text().trim();
    $("#researcherfos").val(resfos);
    $("#researcherfos").val() == null ? $("#researcherfos").val("Field of Study") : $("#researcherfos").val(resfos);
});

//CANCEL RESEARCHER UPDATE
$(document).on("click", "#researchercancelupdate", function (event) {
    //reset the form
    $("#researcherform")[0].reset();
    $("#researcherisupdate").val("false");
    $("#researchersignup").text("Create Account");
    $("#researchercancelupdate").addClass("invisible");
});

//UPDATE FUNDER
$(document).on("click", "#funderupdate", function (event) {
    //populate the form
    $("#funderisupdate").val($(this).data("funderid"));
    $("#funderusername").val($(this).data("funun"));
    $("#funderpassword").val($(this).data("funpw"));
    $("#funderconfpassword").val($(this).data("funpw"));
    $("#funderfirstname").val($(this).closest("tr").find('td:eq(1)').text());
    $("#fundersecondname").val($(this).closest("tr").find('td:eq(2)').text());
    var gender = $(this).closest("tr").find('td:eq(3)').text();
    $("#fundergender").val(gender == "M" ? "Male" : (gender == "F" ? "Female" : "Other"));
    $("#funderemail").val($(this).closest("tr").find('td:eq(4)').text());
    $("#funderphone").val($(this).closest("tr").find('td:eq(5)').text());
    $("#funderorg").val($(this).closest("tr").find('td:eq(6)').text());
    $("#fundersignup").text("Update Account");
    $("#fundercancelupdate").removeClass("invisible");
});

//CANCEL FUNDER UPDATE
$(document).on("click", "#fundercancelupdate", function (event) {
    //reset the form
    $("#funderform")[0].reset();
    $("#funderisupdate").val("false");
    $("#fundersignup").text("Create Account");
    $("#fundercancelupdate").addClass("invisible");
});

//UPDATE CONSUMER
$(document).on("click", "#consumerupdate", function (event) {
    //populate the form
    $("#consumerisupdate").val($(this).data("consumerid"));
    $("#consumerusername").val($(this).data("conun"));
    $("#consumerpassword").val($(this).data("conpw"));
    $("#consumerconfpassword").val($(this).data("conpw"));
    $("#consumerfirstname").val($(this).closest("tr").find('td:eq(1)').text());
    $("#consumerlastname").val($(this).closest("tr").find('td:eq(2)').text());
    var gender = $(this).closest("tr").find('td:eq(3)').text();
    $("#consumergender").val(gender == "M" ? "Male" : (gender == "F" ? "Female" : "Other"));
    $("#consumeremail").val($(this).closest("tr").find('td:eq(4)').text());
    $("#consumerphone").val($(this).closest("tr").find('td:eq(5)').text());
    $("#consumersignup").text("Update Account");
    $("#consumercancelupdate").removeClass("invisible");
});

//CANCEL CONSUMER UPDATE
$(document).on("click", "#consumercancelupdate", function (event) {
    //reset the form
    $("#consumerform")[0].reset();
    $("#consumerisupdate").val("false");
    $("#consumersignup").text("Create Account");
    $("#consumercancelupdate").addClass("invisible");
});

//UPDATE EMPLOYEE
$(document).on("click", "#employeeupdate", function (event) {
    //populate the form
    $("#employeeisupdate").val($(this).data("employeeid"));
    $("#employeeusername").val($(this).data("empun"));
    $("#employeepassword").val($(this).data("emppw"));
    $("#employeeconfpassword").val($(this).data("emppw"));
    $("#employeerolegroup").addClass("invisible");
    $("#employeefirstname").val($(this).closest("tr").find('td:eq(1)').text());
    $("#employeesecondname").val($(this).closest("tr").find('td:eq(2)').text());
    var gender = $(this).closest("tr").find('td:eq(3)').text();
    $("#employeegender").val(gender == "M" ? "Male" : (gender == "F" ? "Female" : "Other"));
    $("#employeeemail").val($(this).closest("tr").find('td:eq(4)').text());
    $("#employeephone").val($(this).closest("tr").find('td:eq(5)').text());
    $("#employeeeid").val($(this).closest("tr").find('td:eq(6)').text());
    //setting date value
    var dateHiredInput = new Date($(this).closest("tr").find('td:eq(8)').text());
    var day = ("0" + dateHiredInput.getDate()).slice(-2);
    var month = ("0" + (dateHiredInput.getMonth() + 1)).slice(-2);
    var dateHiredOutput = dateHiredInput.getFullYear() + "-" + (month) + "-" + (day);
    $("#employeedh").val(dateHiredOutput);
    $("#employeesignup").text("Update Account");
    $("#employeecancelupdate").removeClass("invisible");
    //setting department
    var empdep = $(this).closest("tr").find('td:eq(7)').text().trim();
    $("#employeedep").val(empdep);
    $("#employeedep").val() == null ? $("#employeedep").val("Department") : $("#employeedep").val(empdep);
});

//CANCEL EMPLOYEE UPDATE
$(document).on("click", "#employeecancelupdate", function (event) {
    //reset the form
    $("#employeeform")[0].reset();
    $("#employeeisupdate").val("false");
    $("#employeerolegroup").removeClass("invisible");
    $("#employeesignup").text("Create Account");
    $("#employeecancelupdate").addClass("invisible");
});

//USER DELETE BUTTON EVENT HANDLING + DC ENGINE
//DELETE CONSUMER
$(document).on("click", "#consumerdelete", function (event) {
    $.ajax(
        {
            url: "UserClientAPI",
            type: "DELETE",
            data: "user_id=" + $(this).data("consumerid") + "&usertype=Consumer&task=USERS",
            dataType: "text",
            complete: function (response, status) {
                onConsumerDeleteComplete(response.responseText, status);
                }
         });
});

//DELETE-CONSUMER RESPONSE HANDLING
function onConsumerDeleteComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Account Deleted.", "Account deleted. Check the list of accounts", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#consumerAccountsGrid").html(resultSet.CON);
        } else {
            buildToast("bg-danger", "Error Occurred", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
            $('.toast').toast('show');
        }
    } else if (status == "error") {
        buildToast("bg-danger", "Couldn't Delete the Account", "Error occurred while deleting the account details.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    } else {
        buildToast("bg-danger", "Couldn't Delete the Account", "Unknown Error occurred while deleting the account.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    }
}

//DELETE FUNDER
$(document).on("click", "#funderdelete", function (event) {
    $.ajax(
        {
            url: "UserClientAPI",
            type: "DELETE",
            data: "user_id=" + $(this).data("funderid") + "&usertype=Funder&task=USERS",
            dataType: "text",
            complete: function (response, status) {
                onFunderDeleteComplete(response.responseText, status);
                }
         });
});

//DELETE-FUNDER RESPONSE HANDLING
function onFunderDeleteComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Account Deleted.", "Account deleted. Check the list of accounts", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#funderAccountsGrid").html(resultSet.FUN);
        } else {
            buildToast("bg-danger", "Error Occurred", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
            $('.toast').toast('show');
        }
    } else if (status == "error") {
        buildToast("bg-danger", "Couldn't Delete the Account", "Error occurred while deleting the account details.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    } else {
        buildToast("bg-danger", "Couldn't Delete the Account", "Unknown Error occurred while deleting the account.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    }
}

//DELETE RESEARCHER
$(document).on("click", "#researcherdelete", function (event) {
    $.ajax(
        {
            url: "UserClientAPI",
            type: "DELETE",
            data: "user_id=" + $(this).data("researcherid") + "&usertype=Researcher&task=USERS",
            dataType: "text",
            complete: function (response, status) {
                onResearcherDeleteComplete(response.responseText, status);
                }
         });
});

//DELETE-RESEARCHER RESPONSE HANDLING
function onResearcherDeleteComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Account Deleted.", "Account deleted. Check the list of accounts", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#researcherAccountsGrid").html(resultSet.RES);
        } else {
            buildToast("bg-danger", "Error Occurred", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
            $('.toast').toast('show');
        }
    } else if (status == "error") {
        buildToast("bg-danger", "Couldn't Delete the Account", "Error occurred while deleting the account details.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    } else {
        buildToast("bg-danger", "Couldn't Delete the Account", "Unknown Error occurred while deleting the account.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    }
}

//DELETE EMPLOYEE
$(document).on("click", "#employeedelete", function (event) {
    $.ajax(
        {
            url: "UserClientAPI",
            type: "DELETE",
            data: "user_id=" + $(this).data("employeeid") + "&usertype=Employee&task=USERS",
            dataType: "text",
            complete: function (response, status) {
                onEmployeeDeleteComplete(response.responseText, status);
                }
         });
});

//DELETE-EMPLOYEE RESPONSE HANDLING
function onEmployeeDeleteComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Account Deleted.", "Account deleted. Check the list of accounts", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#employeeAccountsGrid").html(resultSet.EMP);
        } else {
            buildToast("bg-danger", "Error Occurred", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
            $('.toast').toast('show');
        }
    } else if (status == "error") {
        buildToast("bg-danger", "Couldn't Delete the Account", "Error occurred while deleting the account details.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    } else {
        buildToast("bg-danger", "Couldn't Delete the Account", "Unknown Error occurred while deleting the account.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    }
}

//ACCOUNT DELETE BUTTON EVENT HANDLING + DC ENGINE (DC BUS: AccountsAPI)
//DELETE ACCOUNT
$(document).on("click", "#accountdelete", function (event) {
    $.ajax(
        {
            url: "AccountsAPI",
            type: "DELETE",
            data: "user_id=" + $(this).data("accountid"),
            dataType: "text",
            complete: function (response, status) {
                onAccountDeleteComplete(response.responseText, status);
                }
         });
});

//DELETE-ACCOUNT RESPONSE HANDLING
function onAccountDeleteComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Account Deleted.", "Account deleted successfully. Check the list of accounts to see changes.", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#accountsGrid").html(resultSet.ACC);
        } else {
            buildToast("bg-danger", "Error Occurred", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
            $('.toast').toast('show');
        }
    } else if (status == "error") {
        buildToast("bg-danger", "Couldn't Delete the Account", "Error occurred while deleting the account.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    } else {
        buildToast("bg-danger", "Couldn't Delete the Account", "Unknown Error occurred while deleting the account.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    }
}

//ACCOUNT DE-ACTIVATION BUTTON EVENT HANDLING + DC ENGINE (DC BUS: AccountsAPI)
//DEACTIVATE ACCOUNT
$(document).on("click", "#accountactivation", function (event) {
    $.ajax(
        {
            url: "AccountsAPI",
            type: "PUT",
            data: "user_id=" + $(this).data("accountid") + "&isdeactivated=" + $(this).data("isdeactivated"),
            dataType: "text",
            complete: function (response, status) {
                onAccountStatusUpdateComplete(response.responseText, status);
                }
         });
});

//DEACTIVATE-ACCOUNT RESPONSE HANDLING
function onAccountStatusUpdateComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Account Status Updated.", "Account status updated successfully. Check the list of accounts to see changes.", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#accountsGrid").html(resultSet.ACC);
        } else {
            buildToast("bg-danger", "Error Occurred", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
            $('.toast').toast('show');
        }
    } else if (status == "error") {
        buildToast("bg-danger", "Couldn't Update the Status", "Error occurred while setting the account status.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    } else {
        buildToast("bg-danger", "Couldn't Update the Status", "Unknown Error occurred while setting the account status.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    }
}

//----------------------------------------------------------------------------------------------------------------------------
//CLIENT-MODEL----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//FORM VALIDATION HANDLERS
//CONSUMER FORM VALIDATIONS
function validateConsumerForm() {
    if ($("#consumerusername").val().trim() == "") {
        return "Username cannot be empty.";
    }

    if ($("#consumeremail").val().trim() == "") {
        return "Email address cannot be empty.";
    }

    var emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegEx.test($("#consumeremail").val().trim())) {
        return "Enter a valid email address.";
    }

    if ($("#consumerpassword").val().trim() == "") {
        return "Password cannot be empty.";
    }

    if ($("#consumerconfpassword").val().trim() == "") {
        return "Confirmation Password cannot be empty.";
    }

    if ($("#consumerpassword").val().trim() != $("#consumerconfpassword").val().trim()) {
        return "Passwords do not match.";
    }

    if ($("#consumerfirstname").val().trim() == "") {
        return "First name cannot be empty.";
    }

    if ($("#consumerlastname").val().trim() == "") {
        return "Last name cannot be empty.";
    }

    if ($("#consumergender").val().trim() == "Gender") {
        return "Gender cannot be empty.";
    }

    var phoneRegEx = /(0|[+][9][4])[0-9]{9}/;
    if (!phoneRegEx.test($("#consumerphone").val().trim())) {
        return "Enter a valid contact number.";
    }
    return true;
}

//FUNDER FORM VALIDATIONS
function validateFunderForm() { 
    if ($("#funderusername").val().trim() == "") {
        return "Username cannot be empty.";
    }

    if ($("#funderemail").val().trim() == "") {
        return "Email address cannot be empty.";
    }

    var emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegEx.test($("#funderemail").val().trim())) {
        return "Enter a valid email address.";
    }

    if ($("#funderpassword").val().trim() == "") {
        return "Password cannot be empty.";
    }

    if ($("#funderconfpassword").val().trim() == "") {
        return "Confirmation Password cannot be empty.";
    }

    if ($("#funderpassword").val().trim() != $("#funderconfpassword").val().trim()) {
        return "Passwords do not match.";
    }

    if ($("#funderfirstname").val().trim() == "") {
        return "First name cannot be empty.";
    }

    if ($("#fundersecondname").val().trim() == "") {
        return "Last name cannot be empty.";
    }

    if ($("#fundergender").val().trim() == "Gender") {
        return "Gender cannot be empty.";
    }

    var phoneRegEx = /(0|[+][9][4])[0-9]{9}/;
    if (!phoneRegEx.test($("#funderphone").val().trim())) {
        return "Enter a valid contact number.";
    }

    if ($("#funderorg").val().trim() == "") {
        return "Organization cannot be empty.";
    }

    return true;
}

//RESEARCHER FORM VALIDATIONS
function validateResearcherForm() {
    if ($("#researcherusername").val().trim() == "") {
        return "Username cannot be empty.";
    }

    if ($("#researcheremail").val().trim() == "") {
        return "Email address cannot be empty.";
    }

    var emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegEx.test($("#researcheremail").val().trim())) {
        return "Enter a valid email address.";
    }

    if ($("#researcherpassword").val().trim() == "") {
        return "Password cannot be empty.";
    }

    if ($("#researcherconfpassword").val().trim() == "") {
        return "Confirmation Password cannot be empty.";
    }

    if ($("#researcherpassword").val().trim() != $("#researcherconfpassword").val().trim()) {
        return "Passwords do not match.";
    }

    if ($("#researcherfirstname").val().trim() == "") {
        return "First name cannot be empty.";
    }

    if ($("#researchersecondname").val().trim() == "") {
        return "Last name cannot be empty.";
    }

    if ($("#researchergender").val().trim() == "Gender") {
        return "Gender cannot be empty.";
    }

    var phoneRegEx = /(0|[+][9][4])[0-9]{9}/;
    if (!phoneRegEx.test($("#researcherphone").val().trim())) {
        return "Enter a valid contact number.";
    }

    if ($("#researcherinstitute").val().trim() == "") {
        return "Institute cannot be empty.";
    }

    if ($("#researcherfos").val().trim() == "Field of Study") {
        return "Field of Study cannot be empty.";
    }

    if ($("#researcheryoe").val().trim() == "") {
        return "Years of Experience cannot be empty.";
    }

    if (!$.isNumeric($("#researcheryoe").val().trim())) {
        return "Invalid Value given for Years of Experience.";
    }

    if ($("#researcheryoe").val().trim() < 0 || $("#researcheryoe").val().trim() > 100) {
        return "Years of Experience is out of range.";
    }

    return true;
}

//EMPLOYEE FORM VALIDATIONS
function validateEmployeeForm() {
    if ($("#employeeusername").val().trim() == "") {
        return "Username cannot be empty.";
    }

    if ($("#employeeemail").val().trim() == "") {
        return "Email address cannot be empty.";
    }

    var emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegEx.test($("#employeeemail").val().trim())) {
        return "Enter a valid email address.";
    }

    if ($("#employeepassword").val().trim() == "") {
        return "Password cannot be empty.";
    }

    if ($("#employeeconfpassword").val().trim() == "") {
        return "Confirmation Password cannot be empty.";
    }

    if ($("#employeepassword").val().trim() != $("#employeeconfpassword").val().trim()) {
        return "Password do not match.";
    }

    if ($("#employeefirstname").val().trim() == "") {
        return "First name cannot be empty.";
    }

    if ($("#employeesecondname").val().trim() == "") {
        return "Last name cannot be empty.";
    }

    if ($("#employeegender").val().trim() == "Gender") {
        return "Gender cannot be empty.";
    }

    var phoneRegEx = /(0|[+][9][4])[0-9]{9}/;
    if (!phoneRegEx.test($("#employeephone").val().trim())) {
        return "Enter a valid contact number.";
    }

    if ($("#employeeeid").val().trim() == "") {
        return "Employee ID cannot be empty.";
    }

    if ($("#employeedep").val().trim() == "Department") {
        return "Department cannot be empty.";
    }

    if ($("#employeedh").val().trim() == "") {
        return "Date hired cannot be empty.";
    }

    var now = new Date();
    var dateHired = new Date($("#employeedh").val().trim());
    if (dateHired > now) {
        return "Invalid Hired Date.";
    }
	
	if ($("#employeeisupdate").val().trim() == "false") {
	    if ($("#employeerole").val().trim() == "Role") {
	        return "Role cannot be empty.";
	    }
    }

    return true;
}

//PASSWORD VISIBILITY TOGGLE BUTTON EVENT HANDLING FOR SHOW/HIDE PASSWORDS
//RESEARCHER FORM PASSWORDS VISIBILITY
$(document).on("click", "#researchershowpasswords", function (event) {
    if (this.checked) {
        $("#researcherpassword").attr('type', 'text');
        $("#researcherconfpassword").attr('type', 'text');
        $("#researchershowpasswordicon").attr('src', 'Media/eyehide.png');
    } else {
        $("#researcherpassword").attr('type', 'password');
        $("#researcherconfpassword").attr('type', 'password');
        $("#researchershowpasswordicon").attr('src', 'Media/eye.png');
    }
});

//EMPLOYEE FORM PASSWORDS VISIBILITY
$(document).on("click", "#employeeshowpasswords", function (event) {
    if (this.checked) {
        $("#employeepassword").attr('type', 'text');
        $("#employeeconfpassword").attr('type', 'text');
        $("#employeeshowpasswordicon").attr('src', 'Media/eyehide.png');
    } else {
        $("#employeepassword").attr('type', 'password');
        $("#employeeconfpassword").attr('type', 'password');
        $("#employeeshowpasswordicon").attr('src', 'Media/eye.png');
    }
});

//CONSUMER FORM PASSWORDS VISIBILITY
$(document).on("click", "#consumershowpasswords", function (event) {
    if (this.checked) {
        $("#consumerpassword").attr('type', 'text');
        $("#consumerconfpassword").attr('type', 'text');
        $("#consumershowpasswordicon").attr('src', 'Media/eyehide.png');
    } else {
        $("#consumerpassword").attr('type', 'password');
        $("#consumerconfpassword").attr('type', 'password');
        $("#consumershowpasswordicon").attr('src', 'Media/eye.png');
    }
});

//FUNDER FORM PASSWORDS VISIBILITY
$(document).on("click", "#fundershowpasswords", function (event) {
    if (this.checked) {
        $("#funderpassword").attr('type', 'text');
        $("#funderconfpassword").attr('type', 'text');
        $("#fundershowpasswordicon").attr('src', 'Media/eyehide.png');
    } else {
        $("#funderpassword").attr('type', 'password');
        $("#funderconfpassword").attr('type', 'password');
        $("#fundershowpasswordicon").attr('src', 'Media/eye.png');
    }
});

//GENERIC METHOD TO BUILDING DIFFERENT STYLES OF TOASTS
//STYLES ARE PASSED AS PARAMS
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

//INSPECTING COOKIES FOR USER AUTHENTICATION
function isAuthenticated() {
    //check auth cookie
    if (Cookies.get('mdb-auth') == undefined) {
        window.location.href = "Home.jsp";
    }
}