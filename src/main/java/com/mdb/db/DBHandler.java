package com.mdb.db;

import java.sql.Connection;
import java.sql.DriverManager;
import com.mdb.util.DBMethod;

public class DBHandler {
	//LOCAL
	private static final String host = "127.0.0.1";
	private static final String port = "3306";
	private static final String database = "fdmmvdb";
	private static final String username = "root";
	private static final String password = "";
	
	//RDS
	private static final String rds_host = "fdm-database-ins-1.cklh4lbrma3l.us-east-1.rds.amazonaws.com";
	private static final String rds_port = "3306";
	private static final String rds_database = "fdmmvdb";
	private static final String rds_username = "fdmmdbadmin";
	private static final String rds_password = "FDW_W0-v_DTB$";
	private Connection conn = null;
	
	/**
	 * This method returns a usable JDBC database connection to be used by sub classes in the service/project.
	 * 
	 * @return returns a valid SQL connection based on the given connection string
	 */
	public Connection getConnection()
	{
		try
		{
			Class.forName("com.mysql.cj.jdbc.Driver");
			conn = DriverManager.getConnection("jdbc:mysql://"+rds_host+":"+rds_port+"/"+rds_database, rds_username, rds_password);
			//TODO remove local
			//conn = DriverManager.getConnection("jdbc:mysql://"+host+":"+port+"/"+database, username, password);
			
		}
		catch (Exception e)
		{e.printStackTrace();}
		return conn;
	}
	
	/**
	 * This method returns a usable JDBC database connection to be used by sub classes in the service/project.
	 * The type of RDB Connection can be requested via the parameter specification. The same DB can be hosted
	 * in several different services and the access can be provided easily based on the connection requested.
	 * 
	 * @param	dbmethod	The Type of RDB Connection
	 * 
	 * @return 	returns a valid SQL connection based on the given connection string
	 */
	public Connection getConnection(DBMethod dbmethod)
	{
		try
		{
			if (dbmethod== DBMethod.LOCAL_MYSQL) {
				Class.forName("com.mysql.cj.jdbc.Driver");
				conn = DriverManager.getConnection("jdbc:mysql://"+host+":"+port+"/"+database, username, password);
			} else if (dbmethod== DBMethod.RDS_MYSQL) {
				Class.forName("com.mysql.cj.jdbc.Driver");
				conn = DriverManager.getConnection("jdbc:mysql://"+rds_host+":"+rds_port+"/"+rds_database, rds_username, rds_password);
			}
			
		}
		catch (Exception e)
		{e.printStackTrace();}
		return conn;
	}
}
