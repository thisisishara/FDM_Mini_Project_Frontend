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
		System.out.print("\nADEY WORKS");
		JsonObject predictions = mlServiceCommHandler.getPredictions(payload);

		//test the response
		System.out.println("Movie Genres Retrieved: " + predictions.toString());

		jsonResponse = new JsonResponseBuilder().getJsonSuccessResponse("Genres Predicted.");
		jsonResponse.addProperty("GENRES", predictions.get("GENRES").getAsString());

		return jsonResponse;
	}
}
