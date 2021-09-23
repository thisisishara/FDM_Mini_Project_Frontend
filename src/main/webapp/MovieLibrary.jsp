<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Bootstrap CSS -->
<link href="Views/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="Views/styles.dark.css">

<!-- FAVICONS -->
<link rel="icon" href="Media/ticket.png" sizes="32x32" type="image/png">

<title>theMovieDB &#8226; Library</title>
<script src="Components/jquery-3.6.0.min.js"></script>
<script src="Components/MovieLibrary.js"></script>
<script src="Components/js.cookie.min.js"></script>
</head>
<body class="text-dark heromovielib">
	<!-- MAIN HEADER -->
	<header
		class="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow dashboard-header disable-select"
		style="z-index: 101">
		<a href="#"
			class="d-flex align-items-center text-dark text-decoration-none main">
			<img class="mx-2 my-2" src="Media/ticket.png" alt="" width="40"
			height="40"> <span class="fs-4 text-white"><strong>theMovieDB</strong>
				| Library</span>
		</a>
		<button class="navbar-toggler position-absolute d-md-none collapsed"
			type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu"
			aria-controls="sidebarMenu" aria-expanded="false"
			aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>

		<ul class="navbar-nav px-3 list-group list-group-horizontal">
			<li class="nav-item text-nowrap my-auto"><a
				class="nav-link text-white" href="Home.jsp"><button
						type="button" class="btn btn-outline-info btn-sm me-sm-3">Sign
						out</button></a></li>
		</ul>
	</header>
	<!-- VERTICAL SIDEBAR -->
	<nav id="sidebarMenu"
		class="col-md-3 col-lg-2 d-md-block bg-dark text-white sidebar collapse disable-select">
		<div class="position-sticky pt-3">
			<ul class="nav flex-column">
				<li class="nav-item"><a class="nav-link"> <img
						src="Media/movie.png" width="20px" class="mx-2" /> <span
						class="librarylink">Movie Library</span>
				</a></li>
				<li class="nav-item"><a class="nav-link"> <img
						src="Media/gear_white.png" width="20px" class="mx-2" /> <span
						class="librarylink">Profile Settings</span>
				</a></li>
			</ul>
		</div>
	</nav>
	<main class="col-md-9 ms-sm-auto col-lg-10 px-md-4" id="maintag">
		<div class="container-fluid" id="maincontainer">
			<div class="row sidebarpage" id="movielib">
				<div
					class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
					<h1 class="h2">Movie Library</h1>
				</div>
				<div id="collapseUsers"
					class="accordion-collapse collapse show border-top border-bottom"
					aria-labelledby="headingResearchers"
					data-bs-parent="#accordionUserTypeSelect">
					<div class="accordion-body" id="maccbody">
						<div class="mt-0">
							<strong>Welcome to the movie library</strong> <br>You can
							find all available movies here, like them and rate them to find
							more movies that might match your taste. Good hunting!
						</div>
						<div class="movieLibGrid mt-3" id="movieLibGrid">
							<!-- DYNAMICALLY GENERATED MOVIE LIBRARY -->
							<!-- LOADER -->
							<div class="bg-dark text-white rounded p-3">
								<img src="Media/waiting.gif" class="rounded me-2" alt="..."
									width="25px"> <strong class="me-auto">Loading
									Movies</strong>
							</div>

						</div>
					</div>
				</div>
			</div>
			<div class="row sidebarpage" id="movieinfo">
				<div
					class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
					<h1 class="h2">Movie Info</h1>
					<div class="btn-toolbar mb-2 mb-md-0">
						<div class="btn-group me-2">
							<button type="button"
								class="btn btn-sm btn-danger movieinfoclose" id="movieinfoclose">Close</button>
						</div>
					</div>
				</div>
				<div id="collapseMovieInfo"
					class="accordion-collapse collapse show border-top border-bottom"
					aria-labelledby="headingMovieInfo"
					data-bs-parent="#accordionMovieInfo">
					<div class="accordion-body" id="maccbody">
						<div class="movieInfoGrid mt-3" id="movieInfoGrid">
							<!-- DYNAMICALLY GENERATED MOVIE INFO PAGE -->
						</div>
					</div>
				</div>
			</div>
			<div class="row sidebarpage" id="profsett">
				<div
					class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
					<h1 class="h2">Profile Settings</h1>
					<!-- <button class="btn btn-sm btn-success" id="showmovieinfobutton">Show
						Movie Info Temp Button</button>-->
				</div>
				<div>Profile Settings are all good.</div>
			</div>
		</div>
	</main>
	<!-- TOAST 
	<button type="button" class="btn btn-primary" id="liveToastBtn">Show
		live toast</button>-->
	<div class="position-fixed bottom-0 end-0 p-3" style="z-index: 102">
		<div id="liveToast" class="toast hide bg-danger text-white"
			role="alert" aria-live="assertive" aria-atomic="true">
			<div id="liveToastHeaderDiv"
				class="toast-header bg-danger text-white">
				<img id="liveToastIcon" src="Media/error_red_sq.png"
					class="rounded me-2" alt="..." width="25px"> <strong
					class="me-auto" id="liveToastHeading">Bootstrap Toast</strong> <small
					id="liveToastTime">Just Now</small>
				<button type="button" class="btn-close btn-close-white"
					data-bs-dismiss="toast" aria-label="Close"></button>
			</div>
			<div class="toast-body" id="liveToastBody">Hello, world! This
				is a toast message.</div>
		</div>
	</div>
	<!-- LOADER
	<button type="button" class="btn btn-primary" id="loaderBtn">Show
		loader</button> -->
	<div class="position-fixed bottom-0 end-0 p-3" style="z-index: 103">
		<div id="loader" class="loader hide bg-dark text-white" role="alert"
			aria-live="assertive" aria-atomic="true">
			<div id="loaderHeaderDiv" class="loader-header bg-dark text-white">
				<img id="loaderIcon" src="Media/waiting.gif" class="rounded me-2"
					alt="..." width="25px"> <strong class="me-auto"
					id="loaderHeading">Bootstrap Loader</strong> <small id="loaderTime">Just
					Now</small>
				<!-- <button type="button" class="btn-close btn-close-white"
					data-dismiss="loader" aria-label="Close"></button>-->
			</div>
			<div class="loader-body" id="loaderBody">Hello, world! This is
				a loader message.</div>
		</div>
	</div>
	<!-- BOOTSRAP JS CDN-->
	<script src="Components/bootstrap.bundle.min.js"></script>
</body>
</html>