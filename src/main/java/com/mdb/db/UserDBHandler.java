package com.mdb.db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.mdb.util.JsonResponseBuilder;

public class UserDBHandler extends DBHandler {
	public JsonObject insertUser(String email, String password, String role, String first_name, String last_name, String gender) {
		try {
			Connection conn = getConnection();
			if (conn == null) {
				return new JsonResponseBuilder().getJsonErrorResponse("Operation has been terminated due to a database connectivity issue.");
			}

			String query = "INSERT INTO `users`(`fname`, `lname`, `email`, `password`, `role`, `gender`, `cancomment`, `isactive`) VALUES(?,?,?,?,?,?,?,?);";
			PreparedStatement preparedStmt = conn.prepareStatement(query);

			preparedStmt.setString(1, first_name);
			preparedStmt.setString(2, last_name);
			preparedStmt.setString(3, email);
			preparedStmt.setString(4, password);
			preparedStmt.setString(5, role);
			preparedStmt.setString(6, gender);
			preparedStmt.setString(7, "Y");
			preparedStmt.setString(8, "Y");

			int status = preparedStmt.executeUpdate();
			conn.close();

			if(status > 0) {
				return new JsonResponseBuilder().getJsonSuccessResponse("User details inserted successfully");
			} else {
				return new JsonResponseBuilder().getJsonFailedResponse("Error inserting the user details");
			}
		}
		catch (Exception ex) {
			System.err.println(ex.getMessage());
			return new JsonResponseBuilder().getJsonExceptionResponse("Error occurred while inserting user details. Exception Details:" + ex.getMessage());
		}
	}

	public JsonObject authenticate(String email, String password) {
		JsonObject result = null;
		try
		{
			Connection conn = getConnection();
			if (conn == null) {
				return new JsonResponseBuilder().getJsonErrorResponse("Operation has been terminated due to a database connectivity issue."); 
			}

			String query = "SELECT * FROM `users` u WHERE u.`email`= ? AND u.`password`=?;";
			PreparedStatement preparedStmt = conn.prepareStatement(query);

			preparedStmt.setString(1, email);
			preparedStmt.setString(2, password);
			ResultSet rs = preparedStmt.executeQuery();

			if(!rs.isBeforeFirst()) {
				return new JsonResponseBuilder().getJsonFailedResponse("No Users found under the given email.");
			}

			while (rs.next())
			{
				JsonObject recordObject = new JsonResponseBuilder().getJsonSuccessResponse("User authenticated successfully");
				recordObject.addProperty("USERDATA", rs.getString("userid") +":"+ 
						rs.getString("role") +":"+ rs.getString("fname") +":"+ rs.getString("lname") +":"+ 
						rs.getString("email") +":"+ rs.getString("cancomment") +":"+ rs.getString("isactive"));
				recordObject.addProperty("ROLE", rs.getString("role"));

				result = recordObject;
			}
			conn.close();
		}
		catch (Exception ex)
		{
			System.err.println(ex.getMessage());
			result = new JsonResponseBuilder().getJsonExceptionResponse("Error occurred while authenticating the user. Exception Details:" + ex.getMessage());
		}
		return result;
	}

	public JsonObject getUsers() {
		JsonObject result = null;
		JsonArray resultArray = new JsonArray();

		try
		{
			Connection conn = getConnection();
			if (conn == null) {
				return new JsonResponseBuilder().getJsonErrorResponse("Operation has been terminated due to a database connectivity issue."); 
			}

			String query = "SELECT * FROM `users`;";
			PreparedStatement preparedStmt = conn.prepareStatement(query);

			ResultSet rs = preparedStmt.executeQuery();

			if(!rs.isBeforeFirst()) {
				return new JsonResponseBuilder().getJsonFailedResponse("No Users found under the given username.");
			}

			while (rs.next())
			{
				JsonObject recordObject = new JsonObject();
				recordObject.addProperty("userid", rs.getString("userid"));
				recordObject.addProperty("role", rs.getString("role"));
				recordObject.addProperty("email", rs.getString("email"));
				recordObject.addProperty("isactive", rs.getString("isactive"));
				recordObject.addProperty("cancomment", rs.getString("cancomment"));
				recordObject.addProperty("fname", rs.getString("fname"));
				recordObject.addProperty("lname", rs.getString("lname"));
				recordObject.addProperty("gender", rs.getString("gender"));
				recordObject.addProperty("password", rs.getString("password"));
				resultArray.add(recordObject);

			}
			conn.close();

			result = new JsonObject();

			result.add("users", resultArray);

		}
		catch (Exception ex)
		{
			result = new JsonResponseBuilder().getJsonExceptionResponse("Error occurred while retrieving user statistics. Exception Details:" + ex.getMessage());
			System.err.println(ex.getMessage());
		}
		return result;
	}

	public JsonObject updateUser(String user_id, String email, String password, String first_name, String last_name, String gender, String role) {
		JsonObject result = null;
		
		try {
			Connection conn = getConnection();
			if (conn == null) {
				return new JsonResponseBuilder().getJsonErrorResponse("Operation has been terminated due to a database connectivity issue."); 
			}

			String query = "UPDATE `users` SET `email`=?, `password`=?, `fname`=?, `lname`=?, `gender`=?, `role`=? WHERE `userid`=?;";
			PreparedStatement preparedStmt = conn.prepareStatement(query);

			preparedStmt.setString(7, user_id);
			preparedStmt.setString(1, email);
			preparedStmt.setString(2, password);
			preparedStmt.setString(3, first_name);
			preparedStmt.setString(4, last_name);
			preparedStmt.setString(5, gender);
			preparedStmt.setString(6, role);

			int status = preparedStmt.executeUpdate();
			conn.close();

			result = new JsonObject();

			if(status > 0) {
				result = new JsonResponseBuilder().getJsonSuccessResponse("User Account of " + user_id + " was updated Successfully.");
			} else {
				result = new JsonResponseBuilder().getJsonFailedResponse("Unable to update the user account of " + user_id);
			}
		}
		catch (Exception ex) {
			result = new JsonResponseBuilder().getJsonExceptionResponse("Error occurred while updating user account of " +user_id + ". Exception Details:" + ex.getMessage());
			System.err.println(ex.getMessage());
		}
		return result;
	}

	public JsonObject changeUserAccountState(String user_id, String state) {
		JsonObject result = null;
		String operation = null;

		if(state.equalsIgnoreCase("Yes")) {
			operation = "Deactivate";
		} else if (state.equalsIgnoreCase("No")) {
			operation = "Activate";
		}

		try {
			Connection conn = getConnection();
			if (conn == null) {
				return new JsonResponseBuilder().getJsonErrorResponse("Operation has been terminated due to a database connectivity issue."); 
			}

			String query = "UPDATE `user` SET `is_deactivated`=? WHERE `user_id`=?;";
			PreparedStatement preparedStmt = conn.prepareStatement(query);

			preparedStmt.setString(1, state);
			preparedStmt.setString(2, user_id);

			int status = preparedStmt.executeUpdate();
			conn.close();

			result = new JsonObject();

			if(status > 0) {
				result = new JsonResponseBuilder().getJsonSuccessResponse("User Account of " + user_id + " was "+ operation +"d Successfully.");
			} else {
				result = new JsonResponseBuilder().getJsonFailedResponse("Unable to "+ operation +" the user account of " + user_id);
			}
		}
		catch (Exception ex) {
			result = new JsonResponseBuilder().getJsonExceptionResponse("Error occurred while "+ operation +"ting user account of " +user_id + ". Exception Details:" + ex.getMessage());
			System.err.println(ex.getMessage());
		}
		return result;
	}

	public JsonObject changePassword(String user_id, String oldPassword, String newPassword) {
		JsonObject result = null;
		try {			

			Connection conn = getConnection();
			if (conn == null) {
				return new JsonResponseBuilder().getJsonErrorResponse("Operation has been terminated due to a database connectivity issue."); 
			}

			// check if the user is valid by retrieving the user using the old password given
			String queryRtr = "SELECT u.`user_id` FROM `user` u WHERE u.`user_id` = ? AND u.`password`=?;";
			PreparedStatement preparedStmtRtr = conn.prepareStatement(queryRtr);

			preparedStmtRtr.setString(1, user_id);
			preparedStmtRtr.setString(2, oldPassword);
			ResultSet rs = preparedStmtRtr.executeQuery();

			int retrCount = 0;
			while(rs.next()) {
				retrCount++;
				System.out.println(retrCount);
			}


			System.out.println("PASS:::"+retrCount);

			if(!(retrCount>0)) {
				return new JsonResponseBuilder().getJsonErrorResponse("Failed to validate the existing password. Password changing failed.");
			}

			String queryUpd = "UPDATE `user` SET `password`=? WHERE `user_id`=?;";
			PreparedStatement preparedStmtUpd = conn.prepareStatement(queryUpd);

			preparedStmtUpd.setString(1, newPassword);
			preparedStmtUpd.setString(2, user_id);

			int status = preparedStmtUpd.executeUpdate();
			conn.close();

			result = new JsonObject();

			if(status > 0) {
				result = new JsonResponseBuilder().getJsonSuccessResponse("Password Resetted Successfully.");
			} else {
				result = new JsonResponseBuilder().getJsonFailedResponse("Unable to Reset the password of " + user_id);
			}
		}
		catch (Exception ex) {
			result = new JsonResponseBuilder().getJsonExceptionResponse("Error occurred while resetting the password of " +user_id + ". Exception Details:" + ex.getMessage());
			System.err.println(ex.getMessage());
		}
		return result;
	}

	public JsonObject deleteUser(String user_id) {
		try {
			Connection conn = getConnection();
			if (conn == null) {
				return new JsonResponseBuilder().getJsonErrorResponse("Operation has been terminated due to a database connectivity issue.");
			}

			String query = "DELETE FROM `users` WHERE `userid`=?;";
			PreparedStatement preparedStmt = conn.prepareStatement(query);

			preparedStmt.setString(1, user_id);

			int status = preparedStmt.executeUpdate();
			conn.close();

			if(status > 0) {
				return new JsonResponseBuilder().getJsonSuccessResponse("User " + user_id + " deleted successfully.");
			} else {
				return new JsonResponseBuilder().getJsonFailedResponse("Unable to find the User " + user_id);
			}
		}
		catch (Exception ex) {
			System.err.println(ex.getMessage());
			return new JsonResponseBuilder().getJsonExceptionResponse("Error occurred while deleting User " + user_id + ". Exception Details:" + ex);
		}
	}
}
