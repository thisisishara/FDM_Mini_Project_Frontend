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
import com.mdb.security.UserServiceComm;
import com.mdb.util.JsonResponseBuilder;
import com.mdb.util.OpStatus;
import com.mdb.util.RequestHashMapBuilder;

/**
 * Servlet implementation class AccountsAPIServlet
 */
@WebServlet("/AccountsAPI")
public class AccountsAPIServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	UserServiceComm userServiceComm;   

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public AccountsAPIServlet() {
		super();
		userServiceComm = new UserServiceComm();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JsonObject jsonResponse = getAllAccounts(request);
		response.getWriter().append(jsonResponse.toString());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

	}

	/**
	 * @see HttpServlet#doPut(HttpServletRequest, HttpServletResponse)
	 */
	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			Cookie authCookie = getAuthCookie(request);
			String authToken = null;

			if (authCookie == null) {
				JsonObject noAuthResponse = new JsonResponseBuilder().getJsonNoAuthorizationResponse("Authorization Token Not Found.");
				response.getWriter().append(noAuthResponse.toString());
				return;
			}

			authToken = authCookie.getValue().toString();

			HashMap<String, String> requestParameters = new RequestHashMapBuilder().getParameterHashMap(request);
			//getting request parameters
			String userid = requestParameters.get("user_id");
			String isdeactivated = requestParameters.get("isdeactivated");

			//testing task and type
			System.out.println("userid: "+userid+" isdeactivated: "+isdeactivated);

			String URI = "";
			//generating the URI
			if(isdeactivated.equalsIgnoreCase("No")) {
				URI = "users/"+userid+"?deactivate=true";
			} else {
				URI = "users/"+userid+"?deactivate=false";
			}

			//getting the response
			JsonObject serviceResponseJSON = userServiceComm.putAccountStatus(URI, authToken);
			//test the response
			System.out.println(serviceResponseJSON.toString());

			//attach new account list if success
			if (serviceResponseJSON.get("STATUS").getAsString().equalsIgnoreCase(OpStatus.SUCCESSFUL.toString())) {
				//get new list
				JsonObject newList = userServiceComm.getAccounts("users", authToken);	

				//generating HTML table
				String accountsTable = generateAccountsTable(newList);

				serviceResponseJSON.addProperty("ACC", accountsTable);
			}

			response.getWriter().append(serviceResponseJSON.toString());

		} catch (Exception ex) {
			ex.printStackTrace();
			System.out.println("Ex: "+ex);
			JsonObject jsonResponse = new JsonResponseBuilder().getJsonExceptionResponse("Error occurred while updating the account status.\n" + ex.getMessage());
			response.getWriter().append(jsonResponse.toString());
		}
	}

	/**
	 * @see HttpServlet#doDelete(HttpServletRequest, HttpServletResponse)
	 */
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			Cookie authCookie = getAuthCookie(request);
			String authToken = null;

			if (authCookie == null) {
				JsonObject noAuthResponse = new JsonResponseBuilder().getJsonNoAuthorizationResponse("Authorization Token Not Found.");
				response.getWriter().append(noAuthResponse.toString());
				return;
			}

			authToken = authCookie.getValue().toString();

			HashMap<String, String> requestParameters = new RequestHashMapBuilder().getParameterHashMap(request);
			String user_id = requestParameters.get("user_id").toString().toUpperCase();

			//testing task and type
			System.out.println("id: "+user_id);

			//generating the URI
			String URI = "users/"+user_id;

			//getting the response
			JsonObject serviceResponseJSON = userServiceComm.deleteAccount(URI, authToken);
			//test the response
			System.out.println(serviceResponseJSON.toString());

			//attach new account list if success
			if (serviceResponseJSON.get("STATUS").getAsString().equalsIgnoreCase(OpStatus.SUCCESSFUL.toString())) {
				//get new list
				JsonObject newList = userServiceComm.getAccounts("users", authToken);	

				//generating HTML table
				String accountsTable = generateAccountsTable(newList);

				serviceResponseJSON.addProperty("ACC", accountsTable);
			}

			response.getWriter().append(serviceResponseJSON.toString());


		} catch (Exception ex) {
			ex.printStackTrace();
			System.out.println("Ex: "+ex);
			JsonObject jsonResponse = new JsonResponseBuilder().getJsonExceptionResponse("Error occurred while deleting the account.\n" + ex.getMessage());
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

	private JsonObject getAllAccounts(HttpServletRequest request) {
		//Making sure the Authorization Token Cookie is Available
		Cookie authCookie = getAuthCookie(request);
		JsonObject jsonResponse = null;

		if (authCookie == null) {
			jsonResponse = new JsonResponseBuilder().getJsonNoAuthorizationResponse("No Authorization Cookies found that are in a Valid state.");
			return jsonResponse;
		}

		//Attach the Authorization Token to the User Web Service Request
		String authToken = authCookie.getValue().toString();

		//getting the response
		JsonObject accountList = userServiceComm.getAccounts("users", authToken);

		//test the response
		System.out.println(accountList.toString());

		//Generate HTML Tables
		String accountsTable = generateAccountsTable(accountList);

		jsonResponse = new JsonResponseBuilder().getJsonSuccessResponse("Account data retrieved.");
		jsonResponse.addProperty("ACC", accountsTable);

		return jsonResponse;
	}

	private String generateAccountsTable(JsonObject accounts) {
		if(accounts.has("MESSAGE")) {
			return accounts.get("MESSAGE").toString();
		}

		String tableStr = "<table class='table table-sm table-striped table-dark table-hover'><thead>"
				+ "<tr class='align-middle'><th>User ID</th>"
				+ "<th>Role</th>"
				+ "<th>Username</th>"
				+ "<th>Fist Name</th>"
				+ "<th>Last Name</th>"
				+ "<th>Primary Email</th>"
				+ "<th>Primary Phone</th>"
				+ "<th>Delete</th>" //+ "<th>Change Password</th>"
				+ "<th>Activation</th>"
				+ "</tr></thread><tbody>";
		JsonArray accountsArr = accounts.get("users").getAsJsonArray();

		for(JsonElement accountElem : accountsArr) {
			JsonObject account = accountElem.getAsJsonObject();
			tableStr += "<tr><td>"+ account.get("user_id").getAsString() +"</td>"
					+ "<td>"+ account.get("role").getAsString() +"</td>"
					+ "<td>" + account.get("username").getAsString() + "</td>"
					+ "<td>"+ account.get("first_name").getAsString() +"</td>"
					+ "<td>"+ account.get("last_name").getAsString() +"</td>"
					+ "<td>"+ account.get("primary_email").getAsString() +"</td>"
					+ "<td>"+ account.get("primary_phone").getAsString() +"</td>"
					+ "<td class='text-center align-middle'><input name='accountdelete' id='accountdelete' type='button' value='Delete' class='btn btn-danger btn-sm w-100' data-accountid='" + account.get("user_id").getAsString() + "'></td>";

			if(account.get("is_deactivated").getAsString().equalsIgnoreCase("No")) {
				tableStr += "<td class='text-center align-middle'><input name='accountactivation' id='accountactivation' type='button' value='Deactivate' class='btn btn-info btn-sm accountactivation w-100' data-accountid='" + account.get("user_id").getAsString() + "' data-isdeactivated='"+ account.get("is_deactivated").getAsString() +"'></td></tr>";
			} else {
				tableStr += "<td class='text-center align-middle'><input name='accountactivation' id='accountactivation' type='button' value='Activate' class='btn btn-warning btn-sm accountactivation w-100' data-accountid='" + account.get("user_id").getAsString() + "' data-isdeactivated='"+ account.get("is_deactivated").getAsString() +"'></td></tr>";
			}

		}

		tableStr += "</tbody></table>";
		return tableStr;
	}
}
