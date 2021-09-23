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
    loadMovieLibraryContents();
    loadMovieLibrary();
    loadProfile();

    //set toast delay
    setToastDelay(5000);

    //set loader delay
    setLoaderDelay(60000);
    
    buildToast("bg-success", "Welcome.", "Good Movie Hunting!", "", "Media/check_green.png");
    $('.toast').toast('show');
});

//SETTING SIDEBAR ACTIVE LINK
$(document).on("click", ".nav-link", function (event) {
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
    $(".sidebarpage").hide();

    var activeSidebarItem = $(this).find(".librarylink").text();

    if (activeSidebarItem == "Movie Library") {
        isAuthenticated();
        loadMovieLibraryContents();
    } else if (activeSidebarItem == "Profile Settings") {
        isAuthenticated();
        loadProfileContents();
    }
});

function loadMovieLibraryContents() {
    $("#movielib").fadeIn();
}

function loadMovieContents() {
    $("#movieinfo").fadeIn();
}

function loadProfileContents() {
    $("#profsett").fadeIn();
}


//LOAD MOVIE LIB FROM MovieLibAPI DC BUS
function loadMovieLibrary() {
    $.ajax(
        {
            url: "MovieLibAPI",
            type: "GET",
            dataType: "text",
            complete: function (response, status) {
                onLoadMLComplete(response.responseText, status);
            }
        });
}

//MOVIE LIB LOAD RESPONSE HANDLING
function onLoadMLComplete(response, status) {
    if (status == "success") {
		var resultSet = JSON.parse(response);
        $("#movieLibGrid").html(resultSet.MOVIES);
    } else {
        $("#movieLibGrid").html("Couldn't retrieve the movie library. Please try again later.");
    }
}

//LOAD PROFILE FROM UserProfileAPI
function loadProfile() {
    $.ajax(
        {
            url: "UserProfileAPI",
            type: "GET",
            dataType: "text",
            complete: function (response, status) {
                onLoadUPComplete(response.responseText, status);
            }
        });
}

//PROFILE LOAD RESPONSE HANDLING
function onLoadUPComplete(response, status) {
    //if (status == "success") {
    //    var resultSet = JSON.parse(response);
	//
    //    $("#movieGrid").html(resultSet.MOVIES);
    //} else {
    //    $("#movieGrid").html("Couldn't retrieve the list of movies.");
    //}
}

//TOAST TEST EVENT HANDLER
$(document).on("click", "#liveToastBtn", function (event) {
    $('.toast').toast('show');
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

//Clear Movie Info
$(document).on("click", "#movieinfoclose", function (event) {
	$( ".nav-link span:contains('Movie Library')" ).click();
	$("#movieInfoGrid").html("");
});

//Load Movie Info
$(document).on("click", ".movieinfo", function (event) {
    $.ajax(
        {
            url: "MovieInfoAPI",
            type: "GET",
            data: "movieid=" + $(this).data("movieid"),
            dataType: "text",
            complete: function (response, status) {
                onGetMovieInfoComplete(response.responseText, status);
            }
         });
});

//VIEW MOVIE INFO PAGE ON INFO LOAD
function onGetMovieInfoComplete(response, status) {
    if (status == "success") {
		var resultSet = JSON.parse(response);
        $("#movieInfoGrid").html(resultSet.MOVIEINFO);
    } else {
        $("#movieInfoGrid").html("Couldn't retrieve movie info. Please try again later.");
    }
    
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
    $(".sidebarpage").hide();

    loadMovieContents();
}


//LOAD RECOMMENDATIONS
$(document).on("click", "#recommendmovies", function (event) {
	//Validate
	var validationStatus = validateRecommendationInputData();
    if (validationStatus != true) {
        buildToast("bg-danger", "Couldn't get recommendations", validationStatus, "", "Media/error_red_sq.png");
        $('.toast').toast('show');
        return;
    }
    
	//Show loader
	$('.toast').toast('hide');
	buildLoader("bg-dark", "Hang tight!", "We're fetching the recommendations for ya.", "", "Media/waiting.gif");
	$('.loader').toast('show');
	
	//AJAX Call
    $.ajax(
        {
            url: "MLAPI",
            type: "GET",
            data: "movieid="+ $(this).data("movieid") +"&task=" + $(this).data("task") + "&algorithm=" + $("#algoselect").val().trim(),
            dataType: "text",
            complete: function (response, status) {
                onRecommendationComplete(response.responseText, status);
            }
         });
});

//VIEW MOVIE RECOMMENDATIONS
function onRecommendationComplete(response, status) {
	$('.loader').toast('hide');
	
    if (status == "success") {
        var resultSet = JSON.parse(response);

        if (resultSet.STATUS.trim() == "SUCCESSFUL") {
            buildToast("bg-success", "Recommendations Received", "Movie Recommendations were received. If the Recommendations are empty that means there are no recommendations currently under the given algorithm.", "", "Media/check_green.png");
            $('.toast').toast('show');
            $("#recommendationsGrid").html(resultSet.RECOMMENDATIONS);
        } else {
            buildToast("bg-danger", "Error Occurred while getting Recommendations", resultSet.MESSAGE.trim(), "", "Media/error_red_sq.png");
            $('.toast').toast('show');
        }
    } else if (status == "error") {
        buildToast("bg-danger", "Couldn't get Recommendations", "Error occurred while getting Recommendations.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    } else {
        buildToast("bg-danger", "Couldn't get Recommendations", "Unknown Error occurred while getting Recommendations.", "", "Media/error_red_sq.png");
        $('.toast').toast('show');
    }
}

//VALIDATIONS
//RECOMMENDATION DATA VALIDATION
function validateRecommendationInputData() {
    if ($("#algoselect").val().trim() == "") {
        return "Algorithm name cannot be empty.";
    }
	    
    return true;
}