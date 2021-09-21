package com.mdb.api;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonObject;
import com.mdb.db.MovieDBHandler;
import com.mdb.util.JsonResponseBuilder;


@WebServlet("/MovieInfoAPI")
public class MovieInfoAPIServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	MovieDBHandler movieDBHandler;

	public MovieInfoAPIServlet() {
		movieDBHandler = new MovieDBHandler();
	}


	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JsonObject jsonResponse = getMovieInfo(request);
		response.getWriter().append(jsonResponse.toString());
	}


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

	}


	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

	}


	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

	}


	private Cookie getAuthCookie(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		if( cookies == null ) {
			return null;
		}

		for (Cookie cookie : cookies) {

			if(cookie.getName().equalsIgnoreCase("mdb-auth")) {
				return cookie;
			}
		}

		return null;
	}


	private JsonObject getMovieInfo(HttpServletRequest request) {
		//Making sure the Authorization Token Cookie is Available
		Cookie authCookie = getAuthCookie(request);
		JsonObject jsonResponse = null;

		String movieId = request.getParameter("movieid");
		System.out.println("Movie ID is : " + movieId);

		if (authCookie == null) {
			jsonResponse = new JsonResponseBuilder().getJsonNoAuthorizationResponse("No Authorization Cookies found that are in a Valid state.");
			return jsonResponse;
		}

		//getting the response
		JsonObject movieInfo = movieDBHandler.getMovie(movieId);

		//test the response
		System.out.println("Movie Info Retrieved: " + movieInfo.toString());

		//Generate HTML Content
		String movieInfoContent = generateMovieInfoContent(movieInfo);

		jsonResponse = new JsonResponseBuilder().getJsonSuccessResponse("Movie data retrieved.");
		jsonResponse.addProperty("MOVIEINFO", movieInfoContent);

		return jsonResponse;
	}


	private String generateMovieInfoContent(JsonObject movieInfo) {
		if(movieInfo.has("MESSAGE")) {
			return movieInfo.get("MESSAGE").toString();
		}
		
		JsonObject movieObj = movieInfo.get("movieinfo").getAsJsonObject();
		//JsonArray recommendationsArr = movieInfo.get("recommendations").getAsJsonArray();
		
		String thumbnailData = movieObj.get("thumbnail").toString();
		System.out.println("base64::::"+thumbnailData);
		thumbnailData = thumbnailData.substring( 1, thumbnailData.length() - 1 );
		
		String htmlContent = "<div class='col-md-12'>"
				+ "<div class='row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative w-100 bg bg-dark'>"
				+ "<div class='col p-4 d-flex flex-column position-static'>"
				+ "<strong class='d-inline-block mb-2 text-warning'>This Movie</strong>"
				+ "<h2 class='mb-0 text text-white'>" + movieObj.get("name").getAsString() + "</h2>"
				+ "<div class='mb-1 text-secondary'>" + movieObj.get("genre").getAsString() + "</div>"
				+ "<div class='mb-1 text-secondary'>" + movieObj.get("year").getAsString() + "</div>"
				+ "<p class='card-text mb-auto text-white mt-2'>" + movieObj.get("desc").getAsString() + "</p> " //movieObj.get("desc").getAsString()
				+ "<a href='' class='stretched-link text-secondary'>Like</a>"
				+ "</div>"
				+ "<div class='col-auto d-none d-lg-block'>"
				+ "<div class='card-img-top grid m-3' "
				+ "style='background-color: black; background: url("+ thumbnailData +"); background-repeat: no-repeat; background-size: cover; height: 250px; width: 420px'>"
				+ "</div> </div> </div> </div>"
				//Recommendation Selection
				+ "<div class='row g-3 mb-4'>"
				+ "<div class='col-md-9'>"
				+ "<select id='algoselect' name='algoselect' class='form-select'>"
				+ "<option selected>FPG</option>"
				+ "<option>APR</option>"
				+ "</select>"
				+ "</div>"
				+ "<div class='col-md-3'>"
				+ "<button type='button' class='btn btn-warning w-100' id='recommendmovies'"
				+ "name='recommendmovies' data-task='association' data-movieid='" + movieObj.get("movieid").getAsString() + "'>Get Recommendations</button>"
				+ "</div> </div>"
				//Recommendation Grid area
				+ "<div class='row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3'>"
				+ "<div class='col w-100'>"
				+ "<div class='card shadow-sm card-dark-custom'>"
				+ "<div class='grid' style='-bs-columns: 2;'>"
				+ "<div class='card-body grid' id='minfo'>"
				+ "<strong class='d-inline-block mb-2 text-warning'>Movies you'd love</strong>"
				+ "<div class='row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3' id='recommendationsGrid'>"
				+ "<!-- RECOMMENDED TOP 3 MOVIE CARDS -->";				
		htmlContent += "</div> </div> </div> </div> </div> </div>";
		return htmlContent;
	}
}
