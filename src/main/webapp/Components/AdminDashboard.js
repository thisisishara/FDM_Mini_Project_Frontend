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
    loadMovieDetails();

    //set toast delay
    setToastDelay(5000);

    //set loader delay
    setLoaderDelay(60000);
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
    } else if (activeSidebarItem == "Movie Management") {
        isAuthenticated();
        loadAdminMMContents();
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

function loadAdminMMContents() {
    $("#adminmoviemgmt").fadeIn();
}

function loadAdminUMContents() {
    $("#adminusermgmt").fadeIn();
    loadUserAccountDetails();
}

function loadAdminASContents() {
    $("#adminaccsec").fadeIn();
}

function loadAdminPSContents() {
    $("#adminprofsett").fadeIn();
}

//LOAD USER ACCOUNT DETAILS FROM UserClientAPI DC BUS
function loadUserAccountDetails() {
    $.ajax(
        {
            url: "AdminUserMgmtAPI",
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

        $("#userAccountsGrid").html(resultSet.USERS);
    } else {
        $("#userAccountsGrid").html("Couldn't retrieve the list of users.");
    }
}

//LOAD USER ACCOUNT SECURITY DETAILS FROM UserClientAPI DC BUS
function loadUserSecurityDetails() {
    $.ajax(
        {
            url: "AdminSecurityMgmtAPI",
            type: "GET",
            dataType: "text",
            complete: function (response, status) {
                onLoadUADComplete(response.responseText, status);
            }
        });
}

//USER ACC SECURITY TABLE LOAD RESPONSE HANDLING
function onLoadUSDComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);
        $("#userAccountsSecGrid").html(resultSet.ACCOUNTS);
    } else {
        $("#userAccountsSecGrid").html("Couldn't retrieve the list of accounts.");
    }
}

//MOVIE LIST LOAD
function loadMovieDetails() {
    $.ajax(
        {
            url: "MovieAPI",
            type: "GET",
            dataType: "text",
            complete: function (response, status) {
                onLoadMDComplete(response.responseText, status);
            }
        });
}

//MOVIE LIST LOAD RESPONSE HANDLING
function onLoadMDComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        $("#movieGrid").html(resultSet.MOVIES);
    } else {
        $("#movieGrid").html("Couldn't retrieve the list of movies.");
    }
}

//TOAST TEST EVENT HANDLER
$(document).on("click", "#liveToastBtn", function (event) {
    $('.toast').toast('show');
});

//DASHBOARD PAGE LINKS EVENT HANDLING
//Clicks relevent sidebar link on button clicks
$(document).on("click", "#moviedash", function (event) {
	$( ".nav-link span:contains('Movie Management')" ).click();
});

$(document).on("click", "#userdash", function (event) {
	$( ".nav-link span:contains('User Management')" ).click();
});

$(document).on("click", "#securitydash", function (event) {
	$( ".nav-link span:contains('Account Security')" ).click();
});

$(document).on("click", "#profiledash", function (event) {
	$( ".nav-link span:contains('Profile Settings')" ).click();
});

//POST METHODS DC ENGINES TO Communicate with API DC BUS
//HANDLING FORM SUBMISSIONS
//SUBMIT USER FORM
$(document).on("click", "#usersignup", function (event) {
    //form validation
    var validationStatus = validateUserForm();
    if (validationStatus != true) {
        buildToast("bg-danger", "Couldn't Create the Account", validationStatus, "", "Media/error_red_sq.png");
        $('.toast').toast('show');
        return;
    }
    if ($("#userisupdate").val().trim() == "false") {
        $.ajax(
            {
                url: "AdminUserMgmtAPI",
                type: "POST",
                data: $("#userform").serialize(),
                dataType: "text",
                complete: function (response, status) {
                    onUserSaveComplete(response.responseText, status);
                }
            });
    } else {
        $.ajax(
            {
                url: "AdminUserMgmtAPI",
                type: "PUT",
                data: $("#userform").serialize(),
                dataType: "text",
                complete: function (response, status) {
                    onUserUpdateComplete(response.responseText, status);
                }
            });
    }
});

//POST-USER FORM SUBMISSION RESPONSE HANDLING
function onUserSaveComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Account Created.", "Account created successfully. Find it in the list of accounts", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#userAccountsGrid").html(resultSet.NEWUSERS);
        } else {
            buildToast("bg-danger", "", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
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

//PUT-USER RESPONSE HANDLING
function onUserUpdateComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Account Updated.", "Account details updated successfully. Find it in the list of accounts.", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#userAccountsGrid").html(resultSet.NEWUSERS);
        } else {
            buildToast("bg-danger", "", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
            $('.toast').toast('show');
        }
    } else if (status == "error") {
        buildToast("bg-danger", "Couldn't Updated the Account", "Error occurred while saving the new account details.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    } else {
        buildToast("bg-danger", "Couldn't Updated the Account", "Unknown Error occurred while updating the account.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    }
    $("#usercancelupdate").click();
}

//HANDLING USER UPDATE BUTTON CLICK EVENTS
//UPDATE USER
$(document).on("click", "#userupdate", function (event) {
    //populate the form
    $("#userisupdate").val($(this).data("userid"));
    $("#userpassword").val($(this).data("pw"));
    $("#userconfpassword").val($(this).data("pw"));
    $("#userfirstname").val($(this).closest("tr").find('td:eq(1)').text());
    $("#userlastname").val($(this).closest("tr").find('td:eq(2)').text());
    var gender = $(this).closest("tr").find('td:eq(3)').text();
    $("#usergender").val(gender == "M" ? "Male" : (gender == "F" ? "Female" : "Other"));
    $("#useremail").val($(this).closest("tr").find('td:eq(4)').text());
    var role = $(this).closest("tr").find('td:eq(5)').text();
    $("#userrole").val(role == "ADMIN" ? "Administrator" : "User");
    $("#usersignup").text("Update Account");
    $("#usercancelupdate").removeClass("invisible");    
});

//CANCEL RESEARCHER UPDATE
$(document).on("click", "#usercancelupdate", function (event) {
    //reset the form
    $("#userform")[0].reset();
    $("#userisupdate").val("false");
    $("#usersignup").text("Create Account");
    $("#usercancelupdate").addClass("invisible");
});


//USER DELETE BUTTON EVENT HANDLING + DC ENGINE
//DELETE USER
$(document).on("click", "#userdelete", function (event) {
    $.ajax(
        {
            url: "AdminUserMgmtAPI",
            type: "DELETE",
            data: "userid=" + $(this).data("userid"),
            dataType: "text",
            complete: function (response, status) {
                onUserDeleteComplete(response.responseText, status);
            }
         });
});

//DELETE-USER RESPONSE HANDLING
function onUserDeleteComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Account Deleted.", "Account deleted. Check the list of accounts", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#userAccountsGrid").html(resultSet.NEWUSERS);
        } else {
            buildToast("bg-danger", "", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
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


//SUBMIT MOVIE FORM
$(document).on("click", "#addmovie", function (event) {
    //form validation
    var validationStatus = validateMovieForm();
    if (validationStatus != true) {
        buildToast("bg-danger", "Couldn't Create the Account", validationStatus, "", "Media/error_red_sq.png");
        $('.toast').toast('show');
        return;
    }
    if ($("#movieisupdate").val().trim() == "false") {
        $.ajax(
            {
                url: "MovieAPI",
                type: "POST",
                data: $("#movieform").serialize(),
                dataType: "text",
                complete: function (response, status) {
                    onMovieSaveComplete(response.responseText, status);
                }
            });
    } else {
        $.ajax(
            {
                url: "MovieAPI",
                type: "PUT",
                data: $("#movieform").serialize(),
                dataType: "text",
                complete: function (response, status) {
                    onMovieUpdateComplete(response.responseText, status);
                }
            });
    }
});

//POST-MOVIE FORM SUBMISSION RESPONSE HANDLING
function onMovieSaveComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Account Created.", "Movie added successfully. Find it in the list of movies", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#movieGrid").html(resultSet.MOVIES.trim());
        } else {
            buildToast("bg-danger", "", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
            $('.toast').toast('show');
        }
    } else if (status == "error") {
        buildToast("bg-danger", "Couldn't add the Movie", "Error occurred while adding the movie details.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    } else {
        buildToast("bg-danger", "Couldn't Create the Movie", "Unknown Error occurred while adding the movie.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    }
    $("#moviecancelupdate").click();
    
}

//PUT-MOVIE RESPONSE HANDLING
function onMovieUpdateComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Movie Updated.", "Movie details updated successfully. Find it in the list of movies.", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#movieGrid").html(resultSet.MOVIES.trim());
        } else {
            buildToast("bg-danger", "", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
            $('.toast').toast('show');
        }
    } else if (status == "error") {
        buildToast("bg-danger", "Couldn't Updated the Movie", "Error occurred while updating the movie details.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    } else {
        buildToast("bg-danger", "Couldn't Updated the Movie", "Unknown Error occurred while updating the movie.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    }
    $("#moviecancelupdate").click();
}

//HANDLING MOVIE UPDATE BUTTON CLICK EVENTS
//UPDATE MOVIE
$(document).on("click", "#movieupdate", function (event) {
    //populate the form
    $("#movieisupdate").val($(this).data("movieid"));
    $("#moviename").val($(this).closest("#mcard").find('#mname').text());
    $("#moviegenre").val($(this).closest("#mcard").find('#mgenre').text());
    $("#movieyear").val($(this).closest("#mcard").find('#myear').text());
    $("#moviedesc").val($(this).data('moviedesc'));
    $("#addmovie").text("Update Movie");
    $("#moviecancelupdate").removeClass("invisible");
    $("#moviethumb").css({"background": "url('"+$(this).data("thumb")+"')", "background-repeat":"no-repeat", "background-size":"cover"});
    $("#moviethumbtxt").val($(this).data("thumb").split(",")[1]);
});

//CANCEL MOVIE UPDATE
$(document).on("click", "#moviecancelupdate", function (event) {
    //reset the form
    $("#movieform")[0].reset();
    $("#movieisupdate").val("false");
    $("#addmovie").text("Add Movie");
    $("#moviecancelupdate").addClass("invisible");
    $("#moviethumb").css({"background": "url('Media/thumbn.png')", "background-repeat":"no-repeat", "background-size":"cover"});
    $("#moviethumbtxt").val("iVBORw0KGgoAAAANSUhEUgAACFgAAAUqCAYAAADfhFIcAAAACXBIWXMAAAsTAAALEwEAmpwYAAAJ42lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjE4ODdjNjVkLWM5N2YtOTg0OC04YzQxLWY4ZmUyYWVmMTNiOCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpkN2JhM2ViMy1jZTY5LTcxNDMtYjk5OC0wNmUzZWU1MzU3MmQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0iMTczQzU4QTVGNDM3QTkyREI2Q0I5NTU2NDMzREQ4M0UiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0iIiB0aWZmOkltYWdlV2lkdGg9IjMwMDAiIHRpZmY6SW1hZ2VMZW5ndGg9IjIwMDAiIHRpZmY6UGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbj0iMiIgdGlmZjpTYW1wbGVzUGVyUGl4ZWw9IjMiIHRpZmY6WFJlc29sdXRpb249IjEwMC8xIiB0aWZmOllSZXNvbHV0aW9uPSIxMDAvMSIgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMSIgZXhpZjpFeGlmVmVyc2lvbj0iMDIyMSIgZXhpZjpDb2xvclNwYWNlPSI2NTUzNSIgZXhpZjpQaXhlbFhEaW1lbnNpb249IjMwMDAiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIyMDAwIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0wNi0yNFQxNDo1Nzo1MSswNTozMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMDYtMjVUMDI6MjY6MTIrMDU6MzAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMDYtMjVUMDI6MjY6MTIrMDU6MzAiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyYzAyOGNhOC0yMDk5LWJiNDItOGQwZS05NzMyODJkNTQ4OWMiIHN0RXZ0OndoZW49IjIwMjEtMDYtMjVUMDI6MjY6MTIrMDU6MzAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL2pwZWcgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBpbWFnZS9qcGVnIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZDdiYTNlYjMtY2U2OS03MTQzLWI5OTgtMDZlM2VlNTM1NzJkIiBzdEV2dDp3aGVuPSIyMDIxLTA2LTI1VDAyOjI2OjEyKzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjJjMDI4Y2E4LTIwOTktYmI0Mi04ZDBlLTk3MzI4MmQ1NDg5YyIgc3RSZWY6ZG9jdW1lbnRJRD0iMTczQzU4QTVGNDM3QTkyREI2Q0I5NTU2NDMzREQ4M0UiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0iMTczQzU4QTVGNDM3QTkyREI2Q0I5NTU2NDMzREQ4M0UiLz4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJUSFVNQk5BSUwiIHBob3Rvc2hvcDpMYXllclRleHQ9IlRIVU1CTkFJTCIvPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOlRleHRMYXllcnM+IDx0aWZmOkJpdHNQZXJTYW1wbGU+IDxyZGY6U2VxPiA8cmRmOmxpPjg8L3JkZjpsaT4gPHJkZjpsaT44PC9yZGY6bGk+IDxyZGY6bGk+ODwvcmRmOmxpPiA8L3JkZjpTZXE+IDwvdGlmZjpCaXRzUGVyU2FtcGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ph1EdWUAAI1SSURBVHic7N15mFxlmTf+p5qENiSQCSaQEENkFybsyr6LMgphDxAQIQskBPAFx5XREfUV3NB5X5DgqCyKuKKijgsiyCCoKCiXyPgqi8JPXAARJCBDTP/+0Hbapqqec6pOneec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gAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsAAAAAAAAAgAgBCwAAAAAAAACACAELAAAAAAAAAIAIAQsA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0aLUbVATu+++e5g3b17qNnKbPXt2OPLII1O3AQAAtSJgAQAAQM9tscUW4dBDD03dRmWcccYZYdKkSanbYIBttdVW4eSTT07dRqW9/vWvDwcccEDqNqiBOn8vmTAFAAD5CFgAAABQCnu9/8XkyZPDYYcdlroNCCeddFLqFipt7bXXDu9+97vDZpttlroVKmzmzJlhn332Sd1Gx3baaaew/fbbp24DAABqQ8ACAACAUmy33XZh//33T91GcsuXLw9Tp05N3QaEuXPnmiwTsf7664eVK1eGKVOmpG6Filq6dGkYHh5O3UbHGo2G7XAAACAHAQsAAABKc8opp6RuIakJEyaEBQsWpG4D/uaoo45K3ULlbb755uHiiy9O3QYVNGHChDB//vzUbXTtwAMPDNOmTUvdBgAA1IKABQAAAKXZddddw84775y6jWQWL14cNthgg9RtwN/ssssuJqpksNdee4W3vvWtqdugYhYuXBhmzJiRuo2urbPOOrbxAgCAjAQsAAAAKE2j0QinnXZa6jaSOf7441O3AH9neHi4L34DvwyveMUrwoknnpi6DSqknyYSHX744albAACAWhCwAAAAoFT77rtv2HLLLVO3UbqFCxeGjTfeOHUb8Cy77bZb6hZqodFohHPOOSfsvffeqVuhAnbfffcwb9681G0UZvbs2bYMAgCADAQsAAAAKNVaa60VTj/99NRtlM5vvlNVW221VeoWamN4eDi8733vC5tssknqVkjs5JNPTt1C4RYuXJi6BQAAqLwJqRsAAABg8Lz0pS8Nc+bMCQ888EDqVkrxspe9LLzgBS9I3QZjbLrppj2vsf7664fnPOc54bnPfW6YNWtWmDt3bnj+858fttxyy7D11luHddZZp+c9ZDF37twwadKk8NRTT6VupRae+9znhosvvjgcffTRYdWqVanbIYENN9ww7LPPPqnbKNyOO+4Ydthhh/CjH/0odSsAAFBZJlgAAABQuuHh4bBixYrUbZRmyZIlqVsggd///vfhwQcfDD/+8Y/DtddeGz70oQ+Ff/mXfwkLFiwIO+64Y3jta18bbrnllrBmzZqkfU6YMCHsscceSXuom6222ipceOGFqdsgkaVLl4bh4eHUbRSu0WiExYsXp24DAAAqzQQLAEhswYIFqVvI7N577y295qc//enwhje8ofS6APTewQcfHC644ILw8MMPp26lp/bYY4+w0047pW6DinnmmWfC1VdfHa6++uqw8847h7e85S1h3rx5yfp5/vOfn6x2Xe23337hzW9+c3j729+euhVKNGHChDB//vzUbfTMAQccENZff/3w+9//PnUrAABQSSZYAAAAkMSUKVPC8uXLU7fRc8uWLUvdAhV32223hcMPPzx86lOfStbDrFmzktWus5NPPjkcf/zxqdugRMcee2zYYIMNUrfRM+uss46pSwAA0IaABQAAAMkcccQRYfLkyanb6Jltt9027LnnnqnboAbWrFkT3vjGN4bPfvazSerPnDkzSd26azQa4V/+5V/C7rvvnroVSnLMMcekbqHnDjvssDA05K+NAQCgGf+mDAAAQDLTpk0Lp556auo2embFihUeUpHLOeecE/7rv/6r9LpTpkwpvWa/mDRpUvi3f/u3sPHGG6duhR7bddddw7bbbpu6jZ7baKONwpFHHpm6DQAAqCR/ywMAAEBSCxYsCBMmTEjdRuE22WSTcMABB6Rug5pZvXp1uOCCC0qvO2nSpNJr9pMZM2aElStXuo597uSTT07dQmmOO+641C0AAEAlCVgAAACQ1MyZM8OiRYtSt1G4008/PUycODF1G9TQ9ddfH+65555Sa/ZjyKlsW2+9dfg//+f/pG6DHtlwww3Dfvvtl7qN0uy4445hhx12SN0GAABUjoAFAAAAyR1//PGpWyjUjBkzwste9rLUbVBjt9xyS6n1TF4oxoEHHhje+MY3pm6DHli6dGkYHh5OUvtXv/pV6TUbjUZYvHhx6XUBAKDqBCwAAABIbu7cuWHhwoWp2yjM6aef7oE1Xbn99ttLrffUU0+VWq+fLV26NCxYsCB1GxRowoQJYf78+UlqP/DAA+H8889PUvvFL35xmD59epLaAABQVQIWAAAAVMKJJ56YuoVCTJkyJRx22GGp26DmfvrTn5Za7+mnny61Xj9rNBrhLW95S9h1111Tt0JBjj322LDBBhskqf2FL3whfOUrXwn3339/6bUnTZoUlixZUnpdAACoMgELAAAAKuEFL3hBX2yrsXz58jB16tTUbVBzZW8J8Ic//KHUev1unXXWCe9///vD7NmzU7dCAY455pgkdZ988slw+eWXhxBCuOaaa5L0cOihh4ahIX+FDAAAo/zbMQAAAJWxdOnS1C10ZeLEieHoo49O3QZ94Iknnii13q9//etS6w2CmTNnhksuuSRMnDgxdSt0Yddddw3bbrttktrXXXddePTRR0MIIVx++eXhySefLL2HWbNm2fIGAADGELAAAACgMnbcccew1157pW6jY4sXL042Rp7+Mjw8XGq9e++9t9R6g+If//Efw//9v/83dRt04eSTT05Sd2RkJFx22WV/+/Ojjz4abrjhhiS9pJrgAQAAVSRgAQAAQKUsX748dQsdGRoaCgsXLkzdBn1io402KrXeLbfcUmq9QXLQQQeF1772tanboAMzZswI++23X5LaP/zhD8Mdd9zxd5+7/PLLw8jISOm97LDDDmGnnXYqvS4AAFSRgAUAAACVsttuu4UddtghdRu5HXvssWHjjTdO3QZ9Yvbs2aXV+t3vfhfuu+++0uoNomXLloUjjzwydRvktHTp0tKnyYz65Cc/+azP3XbbbeHOO+8svZdGoxEWL15cel0AAKgiAQsAAAAqZWhoKKxYsSJ1G7m98pWvTN0CfWTLLbcsrdbtt99eWq1BNTQ0FN761reaAlAjQ0NDYf78+Ulq//rXvw6f+9znmn7t6quvLrmbv9h///3D9OnTk9QGAIAqEbAAAACgcvbdd99SHzB36+CDDw5bbbVV6jboI/PmzSut1o033lharUE2efLkcOGFF4aZM2emboUMjj322GTv1Re/+MWwZs2apl+76qqrwiOPPFJyRyFMmjQpLFmypPS6AABQNQIWAAAAVM7EiRPD8uXLU7eRmdHpFG3nnXcupc5jjz3W8jflKd6sWbPCJZdcEiZOnJi6FSKOOeaYJHX/9Kc/hY985CMtv7569erw1a9+tcSO/sehhx4ahob8dTIAAIPNvxEDAABQSQcddFDYaKONUrcRtddee4Udd9wxdRv0kQMPPDDMmTOnlFo33HBDeOaZZ0qpxV9st9124YILLkjdBm288IUvDNttt12S2jfccEN4+OGH277msssuC6tXry6po/8xa9asZMETAACoCgELAAAAKmnSpElhxYoVqduIWrZsWeoW6DOnn356KXXWrFkTPvzhD5dSi793yCGHhLPPPjt1G7SwaNGi0Gg0Sq87MjISLrvssujr7rvvvvCd73ynhI6e7dhjj01SFwAAqkLAAgAAgMo69NBDw9SpU1O30dL2228fdt9999Rt0Ede85rXhO23376UWt/+9rfDXXfdVUotnm3FihXhsMMOS90G48yYMSPsv//+SWrfeeed4Qc/+EGm137iE5/ocTfNbbfdduGFL3xhktoAAFAFE1I3AABAtdx7772pWwD4mylTpoQVK1aE888/P3UrTZ122mn2o6cwr3rVq8Jpp51WSq01a9aECy+8sJRaVfDrX/86zJo1K3Ubf2ettdYKb3/728MvfvGLcMcdd6Ruh79aunRpeM5znpOk9qc//enMr/3a174WfvGLX4TnP//5vWuoiUajERYtWpQ5CAIAAP3G3wIBAABQaUcddVQYHh5O3cazbLrppsl+y5n+suWWW4bLLrssnHXWWaVtS/Af//Ef4bbbbiulVhWceeaZYdWqVanbeJYpU6aEiy66KMyYMSN1K4QQhoaGwvz585PU/t3vfhc+9alP5Trmmmuu6VE37e2///7uWQAABpaABQAAAJW2/vrrh1NPPTV1G89y+umnh4kTJ6Zug5pab731wnHHHRcuv/zy8KUvfSnsu+++pdX+wx/+EM4777zS6lXB7bffHs4999ywZs2a1K08y+zZs8Mll1zi50kFHHvssWHmzJlJan/5y18Oq1evznXM5ZdfHp588skeddTac57znLB06dLS6wIAQBXYIgQAAIDKO+6448LKlStzP3zqlQ033DD80z/9U+o26MIRRxxRSp211147rLvuumG99dYLM2bMCDNnzgwbb7xxmDNnTpgwIc1fy7zvfe8Lv/3tb5PUTunqq68Om266aWnbsOSx4447hne/+93h7LPPTt3KQDvmmGOS1H366afDhz/84dzHPfbYY+Gb3/xmkqkb8+fPD+9617sqGVoCAIBeErAAAACg8mbNmhVOPPHEcNlll6VuJYQQwooVK8KkSZNSt0EXLrjggtQtJPGNb3wjXHnllanbSOY973lP2HzzzcNLXvKS1K08y2GHHRbuueeecNFFF6VuZSC98IUvDNttt12S2jfddFP4zW9+09GxV1xxRTjkkENK215o1MyZM8Oxxx4bPvGJT5RaFwAAUrNFCAAAALVwwgknpG4hhPCXrR0OPfTQ1G1Abvfcc0947Wtfm7qN5F71qleFn/zkJ6nbaOpVr3pVOPjgg1O3MZAWLVpUekhh1BVXXNHxsbfffnv48Y9/XGA32aWa+AEAACkJWAAAAFALm266aTj66KNTtxGWLVsWpk6dmroNyOX3v/99WLFiRXj88cdTt5Lc008/HVasWBF+97vfpW7lWSZMmBDOO++8sO2226ZuZaDMmDEj7L///klq33XXXeHmm2/uao3PfvazBXWTz3bbbRde+MIXJqkNAACpCFgAAABQGyeddFLS+sPDw5UIeUAeTzzxRDj77LPDz3/+89StVMYDDzwQzjrrrPDUU0+lbuVZ1l133XDhhReG9ddfP3UrA2Px4sXhOc95TpLaV199dddrfPKTnwwPP/xwAd3k02g0wqJFi0qvCwAAKQlYAAAAUBv/+I//GA466KBk9RctWhRmzJiRrD7k9cQTT4TTTz893HTTTalbqZzvfve74R3veEcYGRlJ3cqzbLzxxuGDH/xgGBryV3e9NjQ0lGzbp0ceeSRceeWVXa+zevXq8JWvfKWAjvI74IADwoYbbpikNgAApOC/0gAAAKiVJUuWJKk7NDQUFi5cmKQ2dOKhhx4Ky5YtE65o46qrrgqXXXZZ6jaa2nnnncO73/3u1G30vQULFoRZs2Ylqf2Vr3wlPPPMM4Wsdemll4bVq1cXslYew8PDYenSpaXXBQCAVAQsAAAAqJWdd9457LHHHqXXXbhwYZgzZ07pdaFTkyZNCgcccECYPHly6lYq7X//7/8dvvWtb6Vuo6kjjzwyLF++PHUbfe2YY45JUveZZ54JH/nIRwpb7/777w+33HJLYevlMX/+/DBhwoQktQEAoGwCFgAAANRKo9EIp556aul1TzzxxNJrQjemTJkSlixZEq6//vpw7LHHpm6n0s4888zw//7f/0vdRlNnn3120q2R+tlOO+0UdthhhyS1b7755nD//fcXuuZVV11V6HpZbbDBBn7GAAAwMAQsAACApqZMmZK6BWogxTjyEELYa6+9wrx580qrd8ghh4Qtt9yytHpjpbrG9I8ZM2aE888/P3z0ox8NG264Yep2KmnVqlXh9NNPD4888kjqVp5l4sSJ4Z3vfGfYZpttUrfSdxYvXhwajUaS2ldeeWXha1577bXhvvvuK3zdLFJNAgEAgLIJWAAAAE2tt956qVvouRkzZiSp++STTyap2ws33nhjkrpDQ0NhxYoVpdVbvHhxabXGS3WN6T977bVX+NKXvmQaQgv33ntvePWrXx2efvrp1K08y9SpU8NFF10Upk2blrqVvjF9+vSw//77J6n9s5/9LFx//fU9Wfuaa67pybox2267bdh1112T1AYAgDIJWAAAQA38+c9/Lr3mIOylPXHixCR116xZk6RuL1xyySVhZGQkSe0Xv/jFYe7cuT2vs/feeycbIf/QQw+Fa6+9Nklt+tP06dPDhRdeWGpAqU5uuumm8M53vjPZz7V2nv/854cPfOADYWjIX+cVYcmSJWHSpElJan/uc5/r2dqXX355WLVqVc/Wb+fkk09OUhcAAMrkv8gAAKAG/vu//7v0moPwW7KpzrGKD+46ddttt4Xvfe97SWpPnDgxnHnmmT2vs2zZsp7XaOXqq6+2RQiFmzBhQnjNa14T3v72t6dupZKuuOKK8PGPfzx1G03ttttu4bzzzkvdRu0NDQ2FQw89NEntP/zhD+FjH/tYz9Z//PHHezYdI2a//fazDREAAH1PwAIAAGrgmWeeKb1mqt/qLNO6666bpO7jjz+epG6vfOQjH0lW+2Uve1lPH+bssMMOYbfdduvZ+u388Y9/DB/84AeT1GYwnHDCCeF973tf6jYq6dxzzw233HJL6jaaOuaYY8Ipp5ySuo1aW7BgQZg1a1aS2l/72tfCU0891dMal19+eZIw5/DwcFi6dGnpdQEAoEwCFgAAUANPPvlk6TUH4TcQUz1c+eMf/5ikbq9885vfDHfeeWeS2pMmTerpVgennXZasnH8X/rSl8Jjjz2WpDaD4/DDDw9vectbUrdROWvWrAkrVqwI99xzT+pWmnrNa14TXvziF6duo7aOOeaYJHX//Oc/hw9/+MM9r/PDH/4w3HHHHT2v08z8+fMHYps5AAAGl4AFAADUQK9/07GZQQhYpDrHfnxo/tGPfjRZ7UMPPTRMnTq18HW32GKLsN9++xW+bhZ/+tOfwsUXX5ykNoPnpJNOSroVTlU9/vjj4fTTTw+PPvpo6laeZeLEieHd73532HLLLVO3Ujs77bRT2GGHHZLU/s53vhPuvffeUmp99rOfLaXOeBtssEE47rjjktQGAIAyCFgAAEANrFq1qvSa06ZNK71m2VIFLB566KEkdXvps5/9bLjvvvuS1J46dWo49dRTC1/3tNNOCxMnTix83Syuvfba8OCDDyapzWA666yzwp577pm6jcr52c9+Fl73utcl2aorZtq0aWHlypVhvfXWS91KrSxevDg0Go0ktT/+8Y+XVuvTn/50sn/fSDUhBAAAyiBgAQAANfCHP/yh9JqDMMFixowZSer+6le/SlK316666qpktRcsWBCGh4cLW2+jjTYKBx10UGHr5fHnP//Z9ApKNzw8HN75zneGKVOmpG6lcr75zW+GCy64IHUbTW2yySbh4osvTraVUd1Mnz497L///klq33fffeHrX/96afVWr14dvvKVr5RWb6x58+aF3XffPUltAADoNf/1BQAANfD73/++9JqzZ88uvWbZNtlkk9Jrrl69Otmkh1674oorwm9+85sktadPnx4WL15c2HrLly8PkyZNKmy9PG688cbws5/9LEltBtvs2bPDueeem7qNSvr3f//38OlPfzp1G03tscce4W1ve1vqNmph0aJFyX62f/7zny+95qWXXpps+srJJ5+cpC4AAPSagAUAANTAI488UnrNjTbaqPSaZUsRInnsscdKr1mW1atXJ9vzPYQQjj/++EJ+i3vq1Knh0EMPLaCj/EZGRsIll1ySpDaEEMLhhx8edtlll9RtVNI555wTbr311tRtNHX88ceHRYsWpW6j0oaGhsJhhx2WpPYf//jHcNlll5Ve94EHHgi33HJL6XVDCGGfffYJM2fOTFIbAAB6ScACAABq4MEHHyy95oYbbhgmTpxYet2yzJ07N8m+9b/73e9Kr1mmD37wg0m2tAnhL4GZE044oet1li1bluTeCCGE73//++EHP/hBktoQwl8eQr/uda9L3UYlrVmzJpx22mnhl7/8ZepWmnrd614X9ttvv9RtVNaRRx6ZLDx67bXXhlWrViWpnWr7ruHh4bB06dIktQEAoJcELAAAoAbuvffe0mtOmDChr3+Lee+9905S91e/+lWSumVZtWpVuOaaa5LVf+UrX9nV8cPDw+Hoo48uqJv8PvKRjySrDaN22mmncMABB6Ruo5IeffTRcOaZZ4bHH388dSvPMjw8HN773veGzTbbLHUrlXTcccclqbtmzZqkP9u/8Y1vJPn3yBBCmD9/fpgwYUKS2gAA0CsCFgAAUAN33nlnkrq77bZbkrpleNGLXpSk7v/3//1/SeqW6QMf+EB46qmnktTebLPNwuGHH97x8YsXLw7Tp08vrqEcfvKTn4RvfOMbSWrDeEuWLEndQmXdeeed4Y1vfGNYvXp16laeZf311w8rV64MU6ZMSd1Kpeywww5hxx13TFL7+9//fvjpT3+apPaoVMHHGTNmhIULFyapDQAAvSJCDAAANfDQQw+Fxx9/vPRtC7bddttS65Up1bml+i3SMj388MPhq1/9ajjyyCOT1F+0aFH4whe+kPu4oaGhpA+CPvrRjyarPYg23XTT0moNDw+H5z73uWHSpElh3XXXDTNnzgwbbbRRmDt3bthss83ClltumSzY08quu+4aNt1004H4mdWJr371q2GzzTYLr371q1O38iybb755uOiii1K3USmLFy8OjUYjSe1PfOITSeqOddlll4VTTjklSfBmwYIF4WMf+1jpdQEAoFcELAAA+DtlPnAqwxFHHBEuuOCC1G0U4v777w/z5s0rtebWW29dar2yzJkzJ8ydOzdJ7VtvvTVJ3bJ94AMfCPPnzw8TJ04svfa2224bDjjggHD99dfnOu74448Pz3ve83rUVXu/+MUvwmc+85kktem9p59+Ojz44INtX7PLLruEww8/PBx00EFh2rRpJXXW2tDQUHjFK14R3va2t6VupbIuuuiisOmmm3Y1NadX9tlnn9QtVMb666+fbMubBx54IHzxi19MUnusJ554Ilx33XVJ7tV58+aF3XffPXznO98pvTYAAPSCLUIAAKAmfvGLX5Rec8aMGWH33XcvvW6vHX300Ul+k/Xxxx8PP/vZz0qvm8J9990XbrjhhmT1TznllNzHnHjiiT3oJJsq/IYzad16663hnHPOCfvuu2/46Ec/WontJ/baa6/ULVTe61//+vDDH/4wdRu0sWTJkrDOOuskqd3JNKVeueKKK8LIyEiS2ieffHKSugAA0AsCFgAAUBM///nPk9Q9+OCDk9TtpVS/yZoiJJPSJZdcEtasWZOk9i677BJe+MIXZn79/PnzwxZbbNHDjlr73e9+Fy677LIktameJ554Ipx77rnh1FNPDY899ljSXjbbbLOwySabJO2h6p555pmwfPny8Ktf/Sp1KzQxNDQUDjvssCS1V61aFS699NIktZu54447wo9+9KMktffZZ58we/bsJLUBAKBoAhYAAFATqbaW6LcJFptttlnYZpttktS+8847k9RN5Uc/+lH47ne/m6R2o9EIp512WubXL168uIfdtPeZz3ymEtMKqJZvfetb4ayzzgpPP/10sh4ajUZ4yUtekqx+XTz00EPhzDPPDE888UTqVhjnyCOPDBtttFGS2tddd13ykNR4n/3sZ5PUHR4eDkuWLElSGwAAijYhdQMAAEA23//+98OqVavC5MmTS627ySabhD333DPcfPPNpdbtlcWLFyfZHiSEdCGZlD70oQ+FPfbYI0ntffbZJ2yzzTbhrrvuavu6/fbbL2y//fYldfX3HnvssXDJJZckqU313XjjjeHjH/940gDQtttum6x2nfzoRz8Kb37zm8N73/vesNZaa6Vuh7867rjjktXeeeedw1e+8pVk9ZtJ9e8/IYRwyCGHhPPOO0+gEACA2hOwAACAmlizZk24++67kzwIfsUrXtEXAYspU6aEQw45JEnt1atXh29961tJaqd04403hjvuuCPJfbvWWmuFFStWhDPOOKPt60455ZSSOnq2a665JqxatSpZfarv/e9/f1iwYEFYd911k9TffPPNk9Sto2uuuSZsvvnm4fTTT0/dCiGEHXbYIey4447J6j/vec9LVruKpk+fHk444YRwxRVXpG4FAAC6YosQAACokR/+8IdJ6u67775h+vTpSWoX6ZRTTkn2kPK//uu/wuOPP56kdmqXX355stovfvGLw9y5c1t+faeddgq77rpriR39j6eeeiqsXLkySW3qY9WqVeHb3/52svqzZs1KVruOLrjggspNLRhUKSdW0dyCBQtStwAAAF0TsAAAgBq58cYbk9R9znOeE/7X//pfSWoXZerUqeH4449PVv/73/9+stqpXXPNNeGee+5JUnt4eDicdtppLb++fPnyMDSU5j+Nv/71r4ff/va3SWpTLz/4wQ+S1V5vvfXC+uuvn6x+HZ199tnhzjvvTN3GQFt//fXDAQcckLoNxtlmm23CnnvumboNAADoioAFAADUyE033ZRsCsKRRx4ZZs+enaR2EV772teG5z73ucnqX3vttclqV8HHPvaxZLUPPvjgphNYttxyy7Dvvvsm6CiEZ555JnzgAx9IUpv6ueuuu5LWbzcFhmd75plnwvLly8NvfvOb1K0MrMWLF4d11lkndRs0cdJJJ6VuAQAAuiJgAQAANbJmzZpw2223Jak9adKk8NrXvjZJ7W5ts8024aijjkpW/1e/+lW49dZbk9WvgiuvvDL8+te/TlJ78uTJYcWKFc/6/PLly8PEiRMTdPSXaTSppnpQPw888EDS+htuuGHS+nX04IMPhrPPPjs8+eSTqVsZSIcddljqFmhhn332qXVgFwAABCwAAKBmrr/++mS1DznkkLDXXnslq9+JoaGh8I53vCMMDw8n6+Gmm25KVrsq1qxZEz75yU8mq3/EEUeEyZMn/+3PG220UTjooIOS9LJmzZpwySWXJKlNPaWaXDRq0qRJSevX1fe+973w1re+NaxZsyZ1KwOl7hO3+t3aa68dlixZkroNAADomIAFAADUzDXXXBOeeuqpJLWHhobC29/+9r97UF1155xzTth+++2T9nDNNdckrV8Vl156afj973+fpPbUqVPDsmXL/vbn0047LdlD41tvvTXcfvvtSWpTT1OnTk3dAh36zGc+Ez7ykY+kbmOgLFy4MHULRBxyyCFhwoQJqdsAAICOCFgAAEDNPPHEE0m3m5g7d25417velax+HkcccUTyvb7vvvvu8L3vfS9pD1WxatWq8IUvfCFZ/WOOOSZMmDAhTJ06NRx66KHJ+vjQhz6UrDb1tMUWW6RugS6cf/754brrrkvdxkDYfvvtw0477ZS6DSKmT58eXvGKV6RuAwAAOiJgAQAANfTFL34xaf2Xv/zl4dWvfnXSHmL23nvv8Pa3vz2stdZaSfv48pe/nLR+1VxyySXhiSeeSFJ7gw02CEuWLAnLly8P6667bpIefvzjH4cbbrghSW3qa4cddkhaP9X3bD85++yzw09/+tPUbfS9RYsWhUajkboNMliwYEHqFgAAoCMCFgAAUEPXXHNNeOSRR5L2cPrppyefDtHKnnvuGS688MKwzjrrJO3jqaeeCh/72MeS9lA1Dz/8cPjqV7+arP7ChQvDUUcdlaz+FVdckaw29bXnnnsmrZ9qW6p+smrVqrB8+fLw0EMPpW6lb02bNi0ceOCBqdsgo6233jrsvffeqdsAAIDcBCwAAKCG1qxZk/QhdQghNBqN8KY3vSksX748aR/jHXzwwWHlypVhvfXWS91KuO6668Kjjz6auo3Kufjii8N///d/J6m98cYbh+nTpyepfc8994TPfe5zSWpTXzvuuGPYcccdk/bwhz/8IWn9fnH//feHV7/61eFPf/pT6lb60uLFi5MHK8mnqkFdAABoR8ACAABq6sMf/nB45plnkvaw1lprhde97nXh/PPPD0ND6f/z4tWvfnV4//vfH6ZMmZK6lfDnP/85fPCDH0zdRiX98pe/DN/85jdTt1G6q666KnUL1MzQ0FD413/916Q/X0dGRsJ9992XrH6/ufnmm8N5550XRkZGUrfSdw4//PDULZDT3nvvHebMmZO6DQAAyCX934ACAAAduf/++8O3v/3t1G2EEEI49thjw+c///nwghe8IEn9TTbZJHzyk58MZ5xxRpgwYUKSHsa7+eabw1133ZW6jcpauXJlWLNmTeo2SvPrX//adjHk9o53vCNsv/32SXt49NFHw6pVq5L20G+uvPJKPw8KduSRR4bZs2enboOcJk6cGJYsWZK6DQAAyEXAAgAAauziiy+uzEPqbbfdNlx99dXhTW96U5g8eXIpNSdPnhzOOeec8KUvfSnssssupdTMYs2aNeHCCy9M3Ual3XnnneHmm29O3UZpPvOZz4TVq1enboOaGB4eDv/2b/8Wjj322NSthIceeih1C33p3HPPDf/5n/+Zuo2+sXDhwtQt0KGDDz44TJw4MXUbAACQmYAFAADU2G233Ra+973vpW7jbyZNmhQWL14cbrzxxvD6178+rL/++j2ps/HGG4c3velN4cYbbwxLly6t3J7rN954Y7jttttSt1F5//7v/566hVI8+uij4UMf+lDqNqiJ+fPnh6997Wvh0EMPTd1KCCGEBx54IHULfeuMM84Id999d+o2am/77bcPO+20U+o26NBzn/vc8IpXvCJ1GwAAkFk1ZucCAAAdu/DCC8Ouu+4ahoaqk59ef/31w7Jly8IrX/nK8J3vfCd861vfCl/72tfCww8/3PGas2fPDi996UvDgQceGF70ohdVZiuQ8Z555plwwQUXpG6jFm6++ebwwx/+MOy4446pW+mpL3zhC7ZYoK2NN944HHXUUeGf/umfwhZbbJG6nb/z4x//OHULfeuJJ54Ip512WvjUpz7Vs0DiIFi0aFFoNBqp26ALRx99dLjssstSt0GBfvKTn6RuIZnzzz8/XHnllanbAAB6qJp/IwkAAGT23e9+N1x//fXhwAMPTN3Ks0yaNCkccMAB4YADDgjnnntuuPvuu8Pdd98d7r///nD33XeHX/7yl+GPf/xjeOyxx8Jvf/vbsOGGG4Z/+Id/COuuu27YdNNNw2abbRbmzJkTttpqq/D85z+/Fg9QPve5z4W77rordRu1cemll/b1dipPPvlkWLlyZeo2SGzy5Mlh6tSpYb311gsbbrhheN7znhfmzJkTNttss7DFFluEOXPmVPbn2yBt5ZPCPffcE173uteFiy++OKy99tqp26mdadOmVfLff8hn6623DnvvvXe46aabUrdCQSZNmpS6hWSqGgIHAIrjn/YAANAH3vOe94S99947DA8Pp26lpaGhobDllluGLbfcMnUrPfPII4+Ed77znanbqJX/+I//CGeeeWbf3hdf/epXu5rcQu/ce++9qVuovMceeyzcfvvtqdvoe9dff31417veFd785jenbqV2Fi1aVLltwujMSSedJGABAEAtVGeGMAAA0LGf//zn4aqrrkrdxsB73/veFx577LHUbdROv45RfuaZZ8JFF12Uug3o2G3/f3v3G+t1Xfdx/J3DWdPl9EZtbdLwhi5nW5vrRjK2Yp5ZbIGZm9LCAt0YZVpBTZM2K2plzkpLERTYIBAYalKIQepE0f6AOtB2MkwgEEM5A4/i2YFzrhvXpesq9YWIfM6fx+MON9+vw9g4O7/n+X43bGg9YdiYP39+3X777a1nDDoTJkxoPYEjZMyYMTVy5MjWMwAAIBJYAADAEHHttdfW9u3bW88Yth588MFasmRJ6xmD0uLFi+uf//xn6xlH3H333Vdbt25tPQMO25o1a1pPGFZmzpxZjzzySOsZg8Z5551Xp5xySusZHCHHHntsXXrppa1nAABAJLAAAIAhoqenp2bNmlV9fX2tpww7XV1dHu3+DvT19Q2539zu6+urm266qfUMOGxdXV21YsWK1jOGlb6+vrrsssvq2WefbT1lUJg4cWLrCRxh48aNG9CvuwMAgCqBBQAADClr1qyp5cuXt54xrPT399f3vvc9Tw95h2677bZ68cUXW884Yh555JHatGlT6xlw2O699946cOBA6xnDTldXV02bNs3rpoIzzzyzzjrrrNYzOMJOPvnk+uIXv9h6BgAAvCWBBQAADDHXXHNNbdmypfWMYWPZsmV19913t54x6PX09Ayp35afM2dO6wlw2Hp6euqWW25pPWPY6uzsrCuvvLJ6e3tbTxmwpkyZUscc48eaQ9EFF1zQegIAALylEa0HAAAAR1ZPT0994xvfqMWLF9cJJ5zQes6QtnHjxrr66qtbzxgybr755vrCF74w6P/dPv7447Vu3brWM+Cw3XPPPbV169bWM4a1e++9t372s5/Vt7/97dZTBpwTTzyxOjo6mtzes2dPfeITnxgW8cuiRYvq7LPPPup3Tz/99PrkJz9ZDzzwwFG/DQAAh0LqDQAAQ9DmzZtr1qxZ1d/f33rKkLVz586aNm1a9fX1tZ4yZOzdu7dWrlzZesY7Nn/+/NYT4LB1d3fXdddd13oGVTV79uy68847W88YcKZMmVLHH398k9urVq0aFnFFVdXSpUub3b744oub3QYAgERgAQAAQ9SyZctq7ty5rWcMSV1dXTV16tTavXt36ylDzk033VQ9PT2tZxy2p59+ekhEIgxf8+fPr507d7aewf/51re+VRs2bGg9Y0A577zzmtw9cOBA3XrrrU1ut7By5cravn17k9ujR4+ukSNHNrkNAACJwAIAAIawH//4x7Vq1arWM4aUV155pa644op68sknW08Zknbs2FFr1qxpPeOwLVq0qPUEOGybNm2qX/ziF61n8G/6+vpq2rRpzT7oHmjOO++8OuWUU5rcfvjhh2vbtm1NbrfSKhg89thj69JLL21yGwAAEoEFAAAMcZdffnmtX7++9YwhYf/+/TVjxox66KGHWk8Z0mbPnl0HDx5sPeNt27FjR/36179uPQMOy759+2rGjBleezQAvfDCC3XZZZfVSy+91HpKcxMnTmx2e+HChc1ut7JgwYJ69dVXm9weN25cHXfccU1uAwDAWxFYAADAENfX11eTJ08WWbxD+/fvr+nTp9fq1atbTxnynnrqqVq3bl3rGW/b0qVLfTjNoHTgwIH67ne/W08//XTrKbyJTZs21cyZMwdlfHaknHnmmXXWWWc1uf33v/+97rvvvia3W3rhhRfqgQceaHL75JNPrkmTJjW5DQAAb0VgAQAAw0Bvb29Nnjx5UH5oPRB0dXXV1KlTxRVH0Zw5c6q/v7/1jEO2Z8+emjt3busZ8Lb19/fXdddd1+xVABy6lStX1o033th6RjNTpkypY45p86PMFStWNLk7ELR89dUFF1zQ7DYAALwZgQUAAAwTr0UWq1ataj1lUNmxY0ddfPHFXgtylD366KO1YcOG1jMO2R133FE9PT2tZ8Db0t/fX7/61a9qzpw5radwiG644Yb67W9/23rGUXfiiSdWR0dHk9t79+5tGhm0tn79+vrrX//a5PZpp51WY8eObXIbAADejMACAACGkb6+vrrsssvqlltu8SqDQ7Bhw4Y6//zz68knn2w9ZViaN29e6wmHpLu7u26++ebWM+BtOXjwYF177bV1/fXXt57C2zR9+vR64oknWs84qqZMmVLHH398k9urV6+ul19+ucntgeLO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AIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAIHAAgAAAAAAAAAgEFgAAAAAAAAAAAQCCwAAAAAAAACAQGABAAAAAAAAABAILAAAAAAAAAAAAoEFAAAAAAAAAEAgsAAAAAAAAAAACAQWAAAAAAAAAACBwAIAAAAAAAAAIBBYAAAAAAAAAAAEAgsAAAAAAAAAgEBgAQAAAAAAAAAQCCwAAAAAAAAAAAKBBQAAAAAAAABAILAAAAAAAAAAAAgEFgAAAAAAAAAAgcACAAAAAAAAACAQWAAAAAAAAAAABAILAAAAAAAAAIBAYAEAAAAAAAAAEAgsAAAAAAAAAAACgQUAAAAAAAAAQCCwAAAAAAAAAAAIBBYAAAAAAAAAAMH/ACBkdAhxmFmrAAAAAElFTkSuQmCC");
});


//MOVIE DELETE BUTTON EVENT HANDLING + DC ENGINE
//DELETE MOVIE
$(document).on("click", "#moviedelete", function (event) {
    $.ajax(
        {
            url: "MovieAPI",
            type: "DELETE",
            data: "movieid=" + $(this).data("movieid"),
            dataType: "text",
            complete: function (response, status) {
                onMovieDeleteComplete(response.responseText, status);
                }
         });
});

//DELETE-MOVIE RESPONSE HANDLING
function onMovieDeleteComplete(response, status) {
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Movie Deleted.", "Movie deleted. Check the list of movie", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#movieGrid").html(resultSet.MOVIES.trim());
        } else {
            buildToast("bg-danger", "", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
            $('.toast').toast('show');
        }
    } else if (status == "error") {
        buildToast("bg-danger", "Couldn't Delete the Movie", "Error occurred while deleting the movie.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    } else {
        buildToast("bg-danger", "Couldn't Delete the Movie", "Unknown Error occurred while deleting the movie.", "", "Media/error_red_sq.png");
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

//MOVIE THUMBNAIN HANDLING
function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			var imageurl = "url('"+ e.target.result + "')";
			
			$('#moviethumb').css({"background":imageurl, "background-repeat":"no-repeat", "background-size":"cover"});
			$('#moviethumbtxt').val(e.target.result.split(",")[1]);
			
			//alert($('#moviethumbtxt').val().trim());
			//var image = new Image();
			//image.src = 'data:image/png;base64,'+$('#moviethumbtxt').val().trim();
			//document.body.appendChild(image);
        };

        reader.readAsDataURL(input.files[0]);
    }
}


//PREDICTING GENRES
$(document).on("click", "#predictgenre", function (event) {	
	//Validate
	var validationStatus = validatePredictionInputData();
    if (validationStatus != true) {
        buildToast("bg-danger", "Couldn't predict genres", validationStatus, "", "Media/error_red_sq.png");
        $('.toast').toast('show');
        return;
    }
    
	//Show loader
	$('.toast').toast('hide');
	buildLoader("bg-dark", "Hang tight!", "We're predicting the genres for ya.", "", "Media/waiting.gif");
	$('.loader').toast('show');
	
	//AJAX Call
    $.ajax(
        {
            url: "MLAPI",
            type: "GET",
            data: "moviename="+ $("#moviename").val().trim() + "&moviedesc="+ $("#moviedesc").val().trim() +"&task=" + $(this).data("task") + "&algorithm=" + $("#algoselect").val().trim(),
            dataType: "text",
            complete: function (response, status) {
                onPredictionComplete(response.responseText, status);
            }
         });
});

//PREDICT GENRES RESPONSE HANDLING
function onPredictionComplete(response, status) {
	$('.loader').toast('hide');

    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Genre Prediction Completed", "Movie Genres were predicted successfully. If the Genres are empty that means no genres were predicted. You can use your own set of genres instead of the suggested ones if necessary.", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#moviegenre").val(resultSet.GENRES);
        } else {
            buildToast("bg-danger", "Error Occurred while Genre Predicting", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
            $('.toast').toast('show');
        }
    } else if (status == "error") {
        buildToast("bg-danger", "Couldn't predict genres", "Error occurred while predicting the genres.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    } else {
        buildToast("bg-danger", "Couldn't predict genres", "Unknown Error occurred while predicting the genres.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    }
}


//----------------------------------------------------------------------------------------------------------------------------
//CLIENT-MODEL----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//FORM VALIDATION HANDLERS
//CONSUMER FORM VALIDATIONS
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
    
    if ($("#userconfpassword").val().trim() == "") {
        return "Confirmation Password cannot be empty.";
    }

    if ($("#userpassword").val().trim() != $("#userconfpassword").val().trim()) {
        return "Passwords do not match.";
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
    
    if ($("#userrole").val().trim() == "Role") {
	        return "Role cannot be empty.";
	}
	    
    return true;
}

//CONSUMER FORM VALIDATIONS
function validateMovieForm() {
    //VALIDATIONS
    if ($("#moviename").val().trim() == "") {
        return "Movie name cannot be empty.";
    }

    if ($("#moviegenre").val().trim() == "") {
        return "Genre cannot be empty.";
    }
   	
    if (!$.isNumeric($("#movieyear").val().trim())) {
        return "Invalid Value given for Year.";
    }

    if ($("#movieyear").val().trim() < 1700 || $("#movieyear").val().trim() > 3000) {
        return "Year is out of range.";
    }

    if ($("#moviedesc").val().trim() == "") {
        return "Description cannot be empty.";
    }
	    
    return true;
}

//PREDICTION DATA VALIDATION
function validatePredictionInputData() {
    //VALIDATIONS
    if ($("#moviename").val().trim() == "") {
        return "Movie name cannot be empty.";
    }

    if ($("#moviedesc").val().trim() == "") {
        return "Description cannot be empty.";
    }
	    
    return true;
}


//PASSWORD VISIBILITY TOGGLE BUTTON EVENT HANDLING FOR SHOW/HIDE PASSWORDS
//RESEARCHER FORM PASSWORDS VISIBILITY
$(document).on("click", "#usershowpasswords", function (event) {
    if (this.checked) {
        $("#userpassword").attr('type', 'text');
        $("#userconfpassword").attr('type', 'text');
        $("#usershowpasswordicon").attr('src', 'Media/eyehide.png');
    } else {
        $("#userpassword").attr('type', 'password');
        $("#userconfpassword").attr('type', 'password');
        $("#usershowpasswordicon").attr('src', 'Media/eye.png');
    }
});

//GENERIC METHOD TO BUILDING DIFFERENT STYLES OF TOASTS
//STYLES ARE PASSED AS PARAMS
function buildToast(bg, heading, body, time, icon) {
	var date = new Date();
	time = date.getHours() + ":" + ("00" + date.getMinutes()).slice(-2);
	
    $("#liveToast").removeClass();
    $("#liveToast").addClass("toast hide text-white " + bg);
    $("#liveToastHeaderDiv").removeClass();
    $("#liveToastHeaderDiv").addClass("toast-header text-white " + bg);
    $("#liveToastIcon").attr("src", icon);
    $("#liveToastTime").text(time);
    $("#liveToastHeading").text(heading);
    $("#liveToastBody").text(body);
}

function setToastDelay(delay) {
	//set toast delay
    $('.toast').toast({
        delay: delay
    });
}

//GENERIC METHOD TO BUILDING DIFFERENT STYLES OF LOADERS
//STYLES ARE PASSED AS PARAMS
function buildLoader(bg, heading, body, time, icon) {
	var date = new Date();
	time = date.getHours() + ":" + ("00" + date.getMinutes()).slice(-2);
	
    $("#loader").removeClass();
    $("#loader").addClass("loader hide text-white " + bg);
    $("#loaderHeaderDiv").removeClass();
    $("#loaderHeaderDiv").addClass("loader-header text-white " + bg);
    $("#loaderIcon").attr("src", icon);
    $("#loaderTime").text(time);
    $("#loaderHeading").text(heading);
    $("#loaderBody").text(body);
}

function setLoaderDelay(delay) {
    $('.loader').toast({
        delay: delay
    });
}

//INSPECTING COOKIES FOR USER AUTHENTICATION
function isAuthenticated() {
    //check auth cookie
    if (Cookies.get('mdb-auth') == undefined) {
        window.location.href = "Home.jsp";
    }
}