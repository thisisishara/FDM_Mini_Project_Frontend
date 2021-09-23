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
	private static final String CLASSIF_ENDPOINT = "/MLService/classification";
	private static final String ASSOCIA_ENDPOINT = "/MLService/association";
	private static final String LOCAL_CLASSIF_URL = PROTOCOL + HOST + ":" + PORT + CLASSIF_ENDPOINT;
	private static final String LOCAL_ASSOCIA_URL = PROTOCOL + HOST + ":" + PORT + ASSOCIA_ENDPOINT;
	private static final String HEROKU_URL = "https://fdm-moviedb.herokuapp.com";
	private static final String HEROKU_CLASSIF_URL = HEROKU_URL + CLASSIF_ENDPOINT;
	private static final String HEROKU_ASSOCIA_URL = HEROKU_URL + ASSOCIA_ENDPOINT;

	private Client client = null;
	private WebResource webRes = null;
	
	//GET PREDICTIONS [USING POST FOR SUBMITTING THE PAYLOAD]
	public JsonObject getPredictions(JsonObject payload)
	{
		client = Client.create();
		webRes = client.resource(HEROKU_CLASSIF_URL);

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
		webRes = client.resource(HEROKU_ASSOCIA_URL);

		String output = webRes//.header("Authorization", SERVICE_TOKEN_FND)
				.entity(payload.toString(), MediaType.APPLICATION_JSON)
				.post(String.class);

		JsonObject JSONoutput = new JsonParser().parse(output).getAsJsonObject();
		return JSONoutput;
	}
}
