package com.mdb.api.comm;

import javax.ws.rs.core.MediaType;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;

public class MLServiceCommHandler {
	private static final String PROTOCOL = "http://";
	private static final String HOST = "127.0.0.1";
	private static final String PORT = "5000";
	private static final String ML_CLASSIF_SERVICE_URI = PROTOCOL + HOST + ":" + PORT + "/MLService/classification";
	private static final String ML_ASSOCIA_SERVICE_URI = PROTOCOL + HOST + ":" + PORT + "/MLService/association";

	private Client client = null;
	private WebResource webRes = null;
	
	//GET PREDICTIONS [USING POST FOR SUBMITTING THE PAYLOAD]
	public JsonObject getPredictions(JsonObject payload)
	{
		client = Client.create();
		webRes = client.resource(ML_CLASSIF_SERVICE_URI);

		String output = webRes//.header("Authorization", SERVICE_TOKEN_FND)
				.entity(payload.toString(), MediaType.APPLICATION_JSON)
				.post(String.class);

		JsonObject JSONoutput = new JsonParser().parse(output).getAsJsonObject();
		return JSONoutput;
	}
	
	//GET RECOMMENDATIONS [USING POST FOR SUBMITTING THE PAYLOAD]
	public JsonObject getRecommendations(JsonObject payload)
	{
		client = Client.create();
		webRes = client.resource(ML_ASSOCIA_SERVICE_URI);

		String output = webRes//.header("Authorization", SERVICE_TOKEN_FND)
				.entity(payload.toString(), MediaType.APPLICATION_JSON)
				.post(String.class);

		JsonObject JSONoutput = new JsonParser().parse(output).getAsJsonObject();
		return JSONoutput;
	}
	
//	//GET Accounts
//	public JsonObject getAccounts(String absolutePath, String AuthToken)
//	{
//		client = Client.create();
//		webRes = client.resource(USER_SERVICE_URI+absolutePath);
//
//		String output = webRes.header("Authorization", "JWT " + AuthToken)
//				.get(String.class);
//
//		JsonObject JSONoutput = new JsonParser().parse(output).getAsJsonObject();
//		return JSONoutput;
//	}
}
