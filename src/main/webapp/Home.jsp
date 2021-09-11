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

<title>theMovieDB &#8226; Welcome</title>
<script src="Components/jquery-3.6.0.min.js"></script>
<script src="Components/Home.js"></script>
<script src="Components/js.cookie.min.js"></script>
</head>
<body class="text-dark heromain">
	<div class="container pt-3 font-light main-container">
		<header
			class="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom disable-select">
			<a href="#"
				class="d-flex align-items-center text-dark text-decoration-none main">
				<img class="mx-2" src="Media/ticket.png" alt="" width="40"
				height="40"> <span class="fs-4">theMovieDB</span>
			</a>

			<nav class="d-inline-flex mt-2 mt-md-0 ms-md-auto ">
				<a class="me-3 py-2 text-dark text-decoration-none"
					href="SignUp.jsp">Sign Up</a>
			</nav>
		</header>
		<main class="mb-0 pb-0">
			<div class="container col-xl-10 col-xxl-8 px-4 py-5 main">
				<div class="row align-items-center g-5 py-5">
					<div class="col-lg-7 text-center text-lg-start disable-select"
						id="heromain">
						<h1 class="display-4 fw-bold lh-1 mb-3">Ohoy!</h1>
						<p class="col-lg-10 fs-4">Hello there, welcome to the
							theMovieDB. Get signed in to see the latest shows and ratings.
							Don't have an account yet? get signed up today.</p>
					</div>
					<div class="col-10 mx-auto col-lg-5 text-dark">
						<form id="loginform" name="loginform"
							class="p-2 border rounded-3 bg-light">
							<input type="hidden" class="formtask" name="formtask" value="SIGNIN">
							<div class="form-floating mb-3">
								<input type="text" class="form-control" id="email"
									name="email" placeholder="Email"> <label
									for="floatingInput">Email</label>
							</div>
							<div class="form-floating mb-3">
								<input type="password" class="form-control" id="password"
									name="password" placeholder="Password"> <label
									for="floatingPassword">Password</label>
							</div>
							<button
								class="btn btn-dark btn-lg px-4 me-sm-3 fw-bold text-white w-100"
								type="button" id="signin" name="signin">Sign In</button>
							<hr class="my-2">
							<small class="text-muted disable-select">Contact
								the Administrator at admin@theMovieDB.lk for any login-related issues.</small>
						</form>
					</div>
				</div>
			</div>
		</main>
		<!-- TOAST -->
		<!--button type="button" class="btn btn-primary" id="liveToastBtn">Show
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
					<h5>Sign Up</h5>
					<ul class="list-unstyled text-small">
						<li class="mb-1"><a
							class="link-secondary text-decoration-none" href="SignUp.jsp">Create
								an account</a></li>
					</ul>
				</div>
				<div class="col-6 col-md">
					<h5>About</h5>
					<ul class="list-unstyled text-small">
						<li class="mb-1"><a
							class="link-secondary text-decoration-none"
							href="#">Additional Services</a></li>
						<li class="mb-1"><a
							class="link-secondary text-decoration-none" href="Dev.jsp">Developer(s)</a></li>
						<li class="mb-1"></li>
					</ul>
				</div>
				<div class="col-6 col-md">
					<h5>Social</h5>
					<ul class="list-unstyled text-small">
						<li class="mb-1"><a
							class="link-secondary text-decoration-none"
							href="#">Suggestions Box</a></li>
						<li class="mb-1"><a
							class="link-secondary text-decoration-none"
							href="#">Contact Us</a></li>
					</ul>
				</div>
			</div>
		</footer>
	</div>
	<!-- BOOTSRAP JS CDN-->
	<script src="Components/bootstrap.bundle.min.js"></script>
</body>
</html>