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
import com.mdb.db.UserDBHandler;
import com.mdb.util.JsonResponseBuilder;
import com.mdb.util.OpStatus;
import com.mdb.util.RequestHashMapBuilder;
import com.mdb.util.UserType;

@WebServlet("/AdminUserMgmtAPI")
public class AdminUserMgmtAPIServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	UserDBHandler userDBHandler;

	public AdminUserMgmtAPIServlet() {
		userDBHandler = new UserDBHandler();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JsonObject jsonResponse = getAllUsers(request);
		response.getWriter().append(jsonResponse.toString());
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			//getting request parameters
			String password = request.getParameter("userpassword");
			String email = request.getParameter("useremail");
			String firstname = request.getParameter("userfirstname");
			String lastname = request.getParameter("userlastname");
			String gender = request.getParameter("usergender");
			String role = getRoleId(request.getParameter("userrole"));

			//get 1-char value for gender
			String genderChar = getGender(gender); 

			//testing parameter values
			System.out.println("user post inputs: " +" "+ password +" "+ email +" "+ firstname +" "+ lastname +" "+ gender +" "+ genderChar +" "+ role);

			//getting the response
			JsonObject dbResponseJSON = userDBHandler.insertUser(email, password, role, firstname, lastname, genderChar);
			//test the response
			System.out.println(dbResponseJSON.toString());
			
			JsonObject accountList = userDBHandler.getUsers();
			dbResponseJSON.addProperty("NEWUSERS", generateUserTable(accountList));

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
			
			String user_id = requestParameters.get("userisupdate");
			String password = requestParameters.get("userpassword");
			String email = requestParameters.get("useremail");
			String firstname = requestParameters.get("userfirstname");
			String lastname = requestParameters.get("userlastname");
			String gender = requestParameters.get("usergender");
			String role = getRoleId(requestParameters.get("userrole"));

			//get 1-char value for gender
			String genderChar = getGender(gender); 

			//testing parameter values
			System.out.println("user post inputs: " + user_id+" "+role +" "+ password +" "+ email +" "+ firstname +" "+ lastname +" "+ gender +" "+ genderChar);

			//getting the response
			JsonObject dbResponseJSON = userDBHandler.updateUser(user_id, email, password, firstname, lastname, genderChar, role);
			//test the response
			System.out.println(dbResponseJSON.toString());

			//attach new account list if success
			if (dbResponseJSON.get("STATUS").getAsString().equalsIgnoreCase(OpStatus.SUCCESSFUL.toString())) {

				JsonObject accountList = userDBHandler.getUsers();
				dbResponseJSON.addProperty("NEWUSERS", generateUserTable(accountList));
			}

			response.getWriter().append(dbResponseJSON.toString());

		} catch (Exception ex) {
			ex.printStackTrace();
			System.out.println("Ex: "+ex);
			JsonObject jsonResponse = new JsonResponseBuilder().getJsonExceptionResponse("Error occurred while updating the account.\n" + ex.getMessage());
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
			String user_id = requestParameters.get("userid").toString().toUpperCase();

			//getting the response
			JsonObject dbResponseJSON = userDBHandler.deleteUser(user_id);
			//test the response
			System.out.println(dbResponseJSON.toString());

			//attach new account list if success
			if (dbResponseJSON.get("STATUS").getAsString().equalsIgnoreCase(OpStatus.SUCCESSFUL.toString())) {				
				JsonObject accountList = userDBHandler.getUsers();
				dbResponseJSON.addProperty("NEWUSERS", generateUserTable(accountList));
			}

			response.getWriter().append(dbResponseJSON.toString());

		} catch (Exception ex) {
			ex.printStackTrace();
			System.out.println("Ex: "+ex);
			JsonObject jsonResponse = new JsonResponseBuilder().getJsonExceptionResponse("Error occurred while deleting the account.\n" + ex.getMessage());
			response.getWriter().append(jsonResponse.toString());
		}
	}

	private String getGender(String gender) {
		if (gender.equalsIgnoreCase("Male")) {
			return "M";
		} else if (gender.equalsIgnoreCase("Female")) {
			return "F";
		}

		return "O";

	}

	private String getRoleId(String role) {

		if (role.equalsIgnoreCase("Administrator")) {
			return UserType.ADMIN.toString();
		} else if (role.equalsIgnoreCase("User")) {
			return UserType.NUSER.toString();
		}
		return UserType.INVLD.toString();
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

	private JsonObject getAllUsers(HttpServletRequest request) {
		//Making sure the Authorization Token Cookie is Available
		Cookie authCookie = getAuthCookie(request);
		JsonObject jsonResponse = null;

		if (authCookie == null) {
			jsonResponse = new JsonResponseBuilder().getJsonNoAuthorizationResponse("No Authorization Cookies found that are in a Valid state.");
			return jsonResponse;
		}

		//getting the response
		JsonObject accountList = userDBHandler.getUsers();

		//test the response
		System.out.println(accountList.toString());

		//Generate HTML Tables
		String userTable = generateUserTable(accountList);

		jsonResponse = new JsonResponseBuilder().getJsonSuccessResponse("User data retrieved.");
		jsonResponse.addProperty("USERS", userTable);

		return jsonResponse;
	}

	private String generateUserTable(JsonObject users) {
		if(users.has("MESSAGE")) {
			return users.get("MESSAGE").toString();
		}

		String tableStr = "<table class='table table-sm table-striped table-dark table-hover'><thead>"
				+ "<tr class='align-middle'><th>User ID</th>"
				+ "<th>First Name</th>"
				+ "<th>Last Name</th>"
				+ "<th>Gender</th>"
				+ "<th>Email</th>"
				+ "<th>Role</th>"
				+ "<th>Update</th>"
				+ "<th>Delete</th>"
				+ "</tr></thread><tbody>";
		JsonArray userArr = users.get("users").getAsJsonArray();

		for(JsonElement userElem : userArr) {
			JsonObject user = userElem.getAsJsonObject();
			tableStr += "<tr><td>"+ user.get("userid").getAsString() +"</td>"
					+ "<td>"+ user.get("fname").getAsString() +"</td>"
					+ "<td>" + user.get("lname").getAsString() + "</td>"
					+ "<td>"+ user.get("gender").getAsString() +"</td>"
					+ "<td>"+ user.get("email").getAsString() +"</td>"
					+ "<td>"+ user.get("role").getAsString() +"</td>"
					+ "<td class='text-center align-middle'><input name='userupdate' id='userupdate' type='button' value='Update' class='btn btn-secondary btn-sm' data-userid='" + user.get("userid").getAsString() + "' data-email='"+ user.get("email").getAsString() +"' data-pw='"+ user.get("password").getAsString() +"'></td>"
					+ "<td class='text-center align-middle'><input name='userdelete' id='userdelete' type='button' value='Delete' class='btn btn-danger btn-sm' data-userid='" + user.get("userid").getAsString() + "'></td></tr>";
		}

		tableStr += "</tbody></table>";
		return tableStr;
	}
}