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
    $('.toast').toast({
        //autohide: false,
        delay: 5000
    });
    
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


//like movie


//rate movie


//temp show movie info button
$(document).on("click", "#showmovieinfobutton", function (event) {
	$(".sidebarpage").hide();
    loadMovieContents();
});