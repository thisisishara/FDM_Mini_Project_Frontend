package com.mdb.api;

import java.io.IOException;
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

@WebServlet("/MovieLibAPI")
public class MovieLibAPIServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	MovieDBHandler movieDBHandler;
	
    public MovieLibAPIServlet() {
    	movieDBHandler = new MovieDBHandler();
    }
    
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JsonObject jsonResponse = getAllMovies(request);
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
					+ "<input name='movieinfo' id='movieinfo-"+ movie.get("movieid").getAsString() +"' type='button' value='View Movie' class='btn btn-sm btn-warning w-100 movieinfo' data-movieid='" + movie.get("movieid").getAsString() + "'></td>"
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
