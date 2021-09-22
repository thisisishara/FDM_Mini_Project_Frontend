package com.mdb.api;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.mdb.db.MovieDBHandler;
import com.mdb.util.JsonResponseBuilder;
import com.mdb.util.OpStatus;
import com.mdb.util.RequestHashMapBuilder;

@WebServlet("/MovieAPI")
public class MovieAPIServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	MovieDBHandler movieDBHandler;

	public MovieAPIServlet() {
		movieDBHandler = new MovieDBHandler();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JsonObject jsonResponse = getAllMovies(request);
		response.getWriter().append(jsonResponse.toString());
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			//getting request parameters
			String name = request.getParameter("moviename");
			String desc = request.getParameter("moviedesc");
			String genre = request.getParameter("moviegenre");
			String year = request.getParameter("movieyear");
			String thumbnail = "data:image/png;base64,"+request.getParameter("moviethumbtxt");
			System.out.println(thumbnail);			
			
			//getting the response
			JsonObject dbResponseJSON = movieDBHandler.insertMovie(name, genre, year, desc, thumbnail);
			//test the response
			System.out.println(dbResponseJSON.toString());

			JsonObject movieList = movieDBHandler.getMovies();
			dbResponseJSON.addProperty("MOVIES",generateMoviesTable(movieList));

			response.getWriter().append(dbResponseJSON.toString());


		} catch (Exception ex) {
			ex.printStackTrace();
			System.out.println("Ex: "+ex);
			JsonObject jsonResponse = new JsonResponseBuilder().getJsonExceptionResponse(ex.getMessage());
			response.getWriter().append(jsonResponse.toString());
		}
	}

	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			Cookie authCookie = getAuthCookie(request);

			if (authCookie == null) {
				JsonObject noAuthResponse = new JsonResponseBuilder().getJsonNoAuthorizationResponse("Authorization Token Not Found.");
				response.getWriter().append(noAuthResponse.toString());
				return;
			}

			HashMap<String, String> requestParameters = new RequestHashMapBuilder().getParameterHashMap(request);
			
			String movieid = requestParameters.get("movieisupdate");
			String name = requestParameters.get("moviename");
			String desc = requestParameters.get("moviedesc");
			String genre = requestParameters.get("moviegenre");
			String year = requestParameters.get("movieyear");
			String thumbnail = "data:image/png;base64,"+requestParameters.get("moviethumbtxt");

			//getting the response
			JsonObject dbResponseJSON = movieDBHandler.updateMovie(movieid, name, genre, desc, year, thumbnail);
			//test the response
			System.out.println(dbResponseJSON.toString());

			//attach new account list if success
			if (dbResponseJSON.get("STATUS").getAsString().equalsIgnoreCase(OpStatus.SUCCESSFUL.toString())) {
				JsonObject movieList = movieDBHandler.getMovies();
				dbResponseJSON.addProperty("MOVIES",generateMoviesTable(movieList));
			}

			response.getWriter().append(dbResponseJSON.toString());

		} catch (Exception ex) {
			ex.printStackTrace();
			System.out.println("Ex: "+ex);
			JsonObject jsonResponse = new JsonResponseBuilder().getJsonExceptionResponse(ex.getMessage());
			response.getWriter().append(jsonResponse.toString());
		}
	}

	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			Cookie authCookie = getAuthCookie(request);
			
			if (authCookie == null) {
				JsonObject noAuthResponse = new JsonResponseBuilder().getJsonNoAuthorizationResponse("Authorization Token Not Found.");
				response.getWriter().append(noAuthResponse.toString());
				return;
			}

			HashMap<String, String> requestParameters = new RequestHashMapBuilder().getParameterHashMap(request);
			String movieid = requestParameters.get("movieid").toString().toUpperCase();

			//getting the response
			JsonObject dbResponseJSON = movieDBHandler.deleteMovie(movieid);
			//test the response
			System.out.println(dbResponseJSON.toString());

			//attach new account list if success
			if (dbResponseJSON.get("STATUS").getAsString().equalsIgnoreCase(OpStatus.SUCCESSFUL.toString())) {
				JsonObject movieList = movieDBHandler.getMovies();
				dbResponseJSON.addProperty("MOVIES",generateMoviesTable(movieList));
			}

			response.getWriter().append(dbResponseJSON.toString());

		} catch (Exception ex) {
			ex.printStackTrace();
			System.out.println("Ex: "+ex);
			JsonObject jsonResponse = new JsonResponseBuilder().getJsonExceptionResponse(ex.getMessage());
			response.getWriter().append(jsonResponse.toString());
		}
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

	private JsonObject getAllMovies(HttpServletRequest request) {
		//Making sure the Authorization Token Cookie is Available
		Cookie authCookie = getAuthCookie(request);
		JsonObject jsonResponse = null;

		if (authCookie == null) {
			jsonResponse = new JsonResponseBuilder().getJsonNoAuthorizationResponse("No Authorization Cookies found that are in a Valid state.");
			return jsonResponse;
		}

		//getting the response
		JsonObject movieList = movieDBHandler.getMovies();

		//test the response
		System.out.println(movieList.toString());

		//Generate HTML Tables
		String movieTable = generateMoviesTable(movieList);

		jsonResponse = new JsonResponseBuilder().getJsonSuccessResponse("Movie list data retrieved.");
		jsonResponse.addProperty("MOVIES", movieTable);

		return jsonResponse;
	}

	private String generateMoviesTable(JsonObject movies) {
		if(movies.has("MESSAGE")) {
			return movies.get("MESSAGE").toString();
		}
		
		String cardStr = "<div class='row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3'>";
		JsonArray movieArr = movies.get("movies").getAsJsonArray();

		for(JsonElement movieElem : movieArr) {
			JsonObject movie = movieElem.getAsJsonObject();
			String thumbnailData = movie.get("thumbnail").toString();
			
			System.out.println("base64::::"+thumbnailData);
			thumbnailData = thumbnailData.substring( 1, thumbnailData.length() - 1 );
			
			cardStr += "<div class='col'>"
					+ "<div class='card shadow-sm card-dark-custom'>"
					+ "<div class='card-img-top' style='background-color:black; background:url("+ thumbnailData +"); background-repeat:no-repeat; background-size:cover; height:250px; width:100%'>"
					+ "</div>"
					+ "<div class='card-body' id='mcard'>"
					+ "<h5 id='mname'>" + movie.get("name").getAsString() + "</h5>"
					+ "<p id='mgenre'>" + movie.get("genre").getAsString() + "</p>"
					+ "<!--<p id='mdesc'>" + movie.get("desc").getAsString() + "</p>-->"+ "<div class='d-flex justify-content-between align-items-center'>"
					+ "<div class='btn-group'>"
					+ "<!--<input name='movieview' id='movieview' type='button' value='View' class='btn btn-sm btn-secondary w-100' data-movieid='" + movie.get("movieid").getAsString() + "'>--></td>"
					+ "<input name='movieupdate' id='movieupdate' type='button' value='Update' class='btn btn-sm btn-secondary w-100' data-thumb='"+ thumbnailData +"' data-movieid='" + movie.get("movieid").getAsString() + "' data-moviedesc=\"" + movie.get("desc").getAsString() + "\"></td>"
					+ "<input name='moviedelete' id='moviedelete' type='button' value='Delete' class='btn btn-sm btn-danger w-100' data-movieid='" + movie.get("movieid").getAsString() + "'></td>"
					+ "</div>"
					+ "<small class='text-muted' id='myear'>" + movie.get("year").getAsString() + "</small>"
					+ "</div>"
					+ "</div>"
					+ "</div>"
					+ "</div>";
		}
		cardStr += "</div>";
		return cardStr;
	}
}
