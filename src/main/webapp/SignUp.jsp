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

<!-- Favicons -->
<link rel="icon" href="Media/ticket.png" sizes="32x32" type="image/png">

<title>theMovieDB &#8226; Sign Up</title>
<!-- <script src="Components/jquery-3.2.1.min.js"></script> -->
<script src="Components/jquery-3.6.0.min.js"></script>
<script src="Components/SignUp.js"></script>
</head>
<body class="text-dark heromain">
	<div class="container py-3 font-light">
		<header
			class="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom disable-select">
			<a href="#"
				class="d-flex align-items-center text-dark text-decoration-none main"
				draggable="false"> <img class="mx-2" src="Media/ticket.png"
				alt="" width="40" height="40" draggable="false"> <span
				class="fs-4">theMovieDB</span>
			</a>
			<nav class="d-inline-flex mt-2 mt-md-0 ms-md-auto ">
				<a class="me-3 py-2 text-dark text-decoration-none" href="Home.jsp">Home</a>
			</nav>
		</header>
		<main class="mb-0 pb-0">
			<!-- CONTENT START -->
			<div class="container col-xl-10 col-xxl-8 px-4 py-0 main">
				<div class="col-md-6 mb-5 disable-select">
					<h3 class="mb-2" id="mainheading">Tell us who you are</h3>
				</div>

				<!-- USER TYPE SIGNUP -->
				<form class="row g-3" id="userform" name="userform">
					<input type="hidden" class="formtask" name="formtask" value="SIGNUP">
					<div class="col-md-6">
						<input type="email" class="form-control" id="useremail"
							name="useremail" placeholder="Email">
					</div>
					<div class="col-md-6">
						<input type="password" class="form-control" id="userpassword"
							name="userpassword" placeholder="Password">
					</div>
					<div class="col-12">
						<div class="input-group">
							<span class="input-group-text disable-select">First and
								last name</span> <input type="text" aria-label="First name"
								class="form-control" id="userfirstname"
								name="userfirstname"> <input type="text"
								aria-label="Last name" class="form-control"
								id="userlastname" name="userlastname">
						</div>
					</div>
					<div class="col-md-4">
						<select id="usergender" name="usergender"
							class="form-select">
							<option selected>Gender</option>
							<option>Female</option>
							<option>Male</option>
							<option>Other</option>
						</select>
					</div>
					<div class="col-12">
						<button type="button" class="btn btn-dark" id="usersignup"
							name="usersignup">Create Account</button>
					</div>
				</form>
			</div>
		</main>
		<!-- TOAST -->
		<!-- button type="button" class="btn btn-primary" id="liveToastBtn">Show
			live toast</button-->
		<div class="position-fixed top-0 end-0 p-3" style="z-index: 5">
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
		<footer class="pt-2 my-md-5 pt-md-5 border-top disable-select">
			<div class="row">
				<div class="col-12 col-md">
					<small class="d-block mb-3 text-muted">&copy; 2021
						theMovieDB.</small>
				</div>
				<div class="col-6 col-md">
					<h5>theMovieDB</h5>
					<ul class="list-unstyled text-small">
						<li class="mb-1"><a
							class="link-secondary text-decoration-none" href="Home.jsp">Home</a></li>
					</ul>
				</div>
				<div class="col-6 col-md">
					<h5>About</h5>
					<ul class="list-unstyled text-small">
						<li class="mb-1"><a
							class="link-secondary text-decoration-none" href="#">Additional
								Services</a></li>
						<li class="mb-1"><a
							class="link-secondary text-decoration-none" href="Dev.jsp">Developer(s)</a></li>
						<li class="mb-1"></li>
					</ul>
				</div>
				<div class="col-6 col-md">
					<h5>Social</h5>
					<ul class="list-unstyled text-small">
						<li class="mb-1"><a
							class="link-secondary text-decoration-none" href="#">Suggestions
								Box</a></li>
						<li class="mb-1"><a
							class="link-secondary text-decoration-none" href="#">Contact
								Us</a></li>
					</ul>
				</div>
			</div>
		</footer>
	</div>
	<!-- BOOTSRAP JS CDN-->
	<script src="Components/bootstrap.bundle.min.js"></script>
</body>
</html>