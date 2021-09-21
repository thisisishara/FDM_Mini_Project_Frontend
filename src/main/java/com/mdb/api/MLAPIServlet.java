package com.mdb.api;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonObject;
import com.mdb.api.comm.MLServiceCommHandler;
import com.mdb.db.MovieDBHandler;
import com.mdb.util.JsonResponseBuilder;

@WebServlet("/MLAPI")
public class MLAPIServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	MovieDBHandler movieDBHandler = null;
	MLServiceCommHandler mlServiceCommHandler = null;

	public MLAPIServlet() {
		movieDBHandler = new MovieDBHandler();
	}


	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String task = request.getParameter("task");

		JsonObject jsonResponse = null;

		if(task.equalsIgnoreCase("classification")) {
			jsonResponse = getPredictedGenres(request);
		} else if (task.equalsIgnoreCase("association")) {
			jsonResponse = getRecommendations(request);
		} else {
			jsonResponse = new JsonResponseBuilder().getJsonErrorResponse("Incompatible operation.");
		}

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


	private JsonObject getPredictedGenres(HttpServletRequest request) {
		//Making sure the Authorization Token Cookie is Available
		Cookie authCookie = getAuthCookie(request);
		JsonObject jsonResponse = null;

		String movieId = request.getParameter("movieid");
		System.out.println("Movie ID is : " + movieId);

		if (authCookie == null) {
			jsonResponse = new JsonResponseBuilder().getJsonNoAuthorizationResponse("No Authorization Cookies found that are in a Valid state.");
			return jsonResponse;
		}

		//Call flask back-end to get predictions
		mlServiceCommHandler = new MLServiceCommHandler();
		String moviename = request.getParameter("moviename");
		String moviedesc = request.getParameter("moviedesc");
		String algorithm = request.getParameter("algorithm");

		//Test
		System.out.println("ML DATA: "+moviename + " " + moviedesc + " " + algorithm);

		JsonObject payload = new JsonObject();
		payload.addProperty("ALGO", algorithm);
		payload.addProperty("PLOT", moviedesc);

		JsonObject predictions = mlServiceCommHandler.getPredictions(payload);

		//test the response
		System.out.println("Movie Genres Retrieved: " + predictions.toString());

		jsonResponse = new JsonResponseBuilder().getJsonSuccessResponse("Genres Predicted.");
		jsonResponse.addProperty("GENRES", predictions.get("GENRES").getAsString());

		return jsonResponse;
	}


	private JsonObject getRecommendations(HttpServletRequest request) {
		//Making sure the Authorization Token Cookie is Available
		Cookie authCookie = getAuthCookie(request);
		JsonObject jsonResponse = null;

		if (authCookie == null) {
			jsonResponse = new JsonResponseBuilder().getJsonNoAuthorizationResponse("No Authorization Cookies found that are in a Valid state.");
			return jsonResponse;
		}

		//Call flask back-end to get predictions
		mlServiceCommHandler = new MLServiceCommHandler();
		String movieid = request.getParameter("movieid");
		String algorithm = request.getParameter("algorithm");

		//Test
		System.out.println("Movie ID is : " + movieid + " , Algorithm is : " + algorithm);

		JsonObject payload = new JsonObject();
		payload.addProperty("ALGO", algorithm);
		payload.addProperty("MOVI_LIST", "\""+ movieid.toString()+ "\"");

		JsonObject predictions = mlServiceCommHandler.getRecommendations(payload);

		//Test the response
		System.out.println("Recommendations Retrieved: " + predictions.toString());

		String []movie_list_str = predictions.get("MOVIES").getAsString().replaceAll("\\[", "").replaceAll("\\]","").split(",");
		String movie_rec_HTML = "";

		if (movie_list_str.length > 0) {
			for(int i=0; i<movie_list_str.length; i++) {
				JsonObject movieInfo = movieDBHandler.getMovie(movie_list_str[i]);

				//Test the response
				System.out.println("Movie Info Retrieved: " + movieInfo.toString());

				//Generate HTML Content
				String htmlContent = generateRecommendationsHTML(movieInfo);
				movie_rec_HTML += htmlContent;
			}
		}		

		if(movie_rec_HTML.equalsIgnoreCase("")) {
			movie_rec_HTML = "<div class='card-body grid' id='minfo'>"
			+ "<p class='d-inline-block mb-0 text-white'>No Recommendations "
			+ "for this Movie :(\nMaybe try changing the Algorithm!</div>";
		}
		
		jsonResponse = new JsonResponseBuilder().getJsonSuccessResponse("Recommendations Retrieved.");
		jsonResponse.addProperty("RECOMMENDATIONS", movie_rec_HTML);

		return jsonResponse;
	}

	private String generateRecommendationsHTML(JsonObject movieInfo) {
		if(movieInfo.has("MESSAGE")) {
			return "";
		}
		
		JsonObject movie = movieInfo.get("movieinfo").getAsJsonObject();

		String htmlContent = "<div class='row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3'>"
				+ "<div class='col w-100'>"
				+ "<div class='card shadow-sm card-dark-custom'>"
				+ "<div class='grid' style='-bs-columns: 2;'>"
				+ "<div class='card-img-top'"
				+ "style='background-color: black; background: url('Media/thumbn.png'); background-repeat: no-repeat; background-size: cover; height: 250px; width: 100%'>"
				+ "</div>"
				+ "<div class='card-body grid' id='minfo'>"
				+ "<strong class='d-inline-block mb-0 text-white'>" + movie.get("name").getAsString() + "</strong> "
				+ "<br> <small class='text-muted' id='myear'>" + movie.get("year").getAsString() + "</small>"
				+ "<div class='d-flex justify-content-between align-items-center'>"
				+ "<div class='btn-group mt-2'>"
				+ "<input name='movieinfo' id='movieinfo-"+ movie.get("movieid").getAsString() +"'type='button' value='View Movie' "
				+ "class='btn btn-sm btn-warning w-100 movieinfo' data-movieid='" + movie.get("movieid").getAsString() +"'>"
				+ "</div> </div> </div> </div> </div> </div> </div>";
		return htmlContent;
	}
}
