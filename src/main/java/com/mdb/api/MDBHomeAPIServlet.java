package com.mdb.api;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonObject;
import com.mdb.db.UserDBHandler;
import com.mdb.util.JsonResponseBuilder;
import com.mdb.util.TaskType;
import com.mdb.util.UserType;

@WebServlet("/MDBHomeAPI")
public class MDBHomeAPIServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	UserDBHandler userDBHandler;

	public MDBHomeAPIServlet() {
		userDBHandler = new UserDBHandler();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			String task = request.getParameter("formtask").toString().toUpperCase();

			if(task.equalsIgnoreCase(TaskType.SIGNUP.toString())) {
				//getting request parameters
				String password = request.getParameter("userpassword");
				String email = request.getParameter("useremail");
				String firstname = request.getParameter("userfirstname");
				String lastname = request.getParameter("userlastname");
				String gender = request.getParameter("usergender");
				String role = UserType.NUSER.toString().toUpperCase();

				//get 1-char value for gender
				String genderChar = getGender(gender); 

				//testing parameter values
				System.out.println("user post inputs: " +" "+ password +" "+ email +" "+ firstname +" "+ lastname +" "+ gender +" "+ genderChar +" "+ role);

				//getting the response
				JsonObject dbResponseJSON = userDBHandler.insertUser(email, password, role, firstname, lastname, genderChar);
				//test the response
				System.out.println(dbResponseJSON.toString());

				response.getWriter().append(dbResponseJSON.toString());
			} else if(task.equalsIgnoreCase(TaskType.SIGNIN.toString())){ 
				String email = request.getParameter("email");
				String password = request.getParameter("password");
				
				System.out.println("UN: "+email +" PW: "+password);
				
				// getting the response
				JsonObject dbResponseJSON = userDBHandler.authenticate(email, password);
				
				//test the output
				System.out.println(dbResponseJSON.toString());

				//Inspect the response and add cookies
				if (dbResponseJSON.has("USERDATA")) {					
					response.getWriter().append(dbResponseJSON.toString());
				} else {
					throw new Exception("Error occurred while authenticating the user.");
				}
			}
			else  {
				throw new Exception("Invalid Request.");
			}

		} catch (Exception ex) {
			ex.printStackTrace();
			System.out.println("Ex: "+ex);
			JsonObject jsonResponse = new JsonResponseBuilder().getJsonExceptionResponse(ex.getMessage());
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
}