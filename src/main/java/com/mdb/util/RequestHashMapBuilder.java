package com.mdb.util;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Scanner;

import javax.servlet.http.HttpServletRequest;

public class RequestHashMapBuilder {
	//Convert HttpServletRequest parameters to a HashMap for put and delete requests
	public HashMap<String,String> getParameterHashMap(HttpServletRequest request)
	{
		HashMap<String, String> map = new HashMap<String, String>();
		try
		{
			Scanner scanner = new Scanner(request.getInputStream(), "UTF-8");
			String queryString = scanner.hasNext() ? scanner.useDelimiter("\\A").next() : "";
			scanner.close();
			String[] params = queryString.split("&");
			for (String param : params)
			{
				String[] p = param.split("=");
				map.put(p[0], java.net.URLDecoder.decode(p[1], StandardCharsets.UTF_8.name()));
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return map;
	}
}
