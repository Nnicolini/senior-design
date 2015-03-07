import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class TransactionServlet extends HttpServlet{

	private static final long serialVersionUID = 2702524403574618122L;
	private static final String PROPERTIESFILENAME = "db.properties";
	
	private static String URL;
	private static String HOST;
	private static String PORT;
	private static String DBNAME;
	private static String USERNAME;
	private static String PASSWORD;
	
	private static Connection conn = null;
	
	public void init() throws ServletException{
		try{
			Properties properties = new Properties();
			
			try {
				properties.load(getServletContext().getResourceAsStream("/WEB-INF/" + PROPERTIESFILENAME));
			} catch (IOException e) {
				e.printStackTrace();
			}
			
			HOST = properties.getProperty("host");
			PORT = properties.getProperty("port");
		    DBNAME = properties.getProperty("dbname");
		    USERNAME = properties.getProperty("username");
		    PASSWORD = properties.getProperty("password");
		    
		    URL = "jdbc:mysql://" + HOST + ":" + PORT + "/" + DBNAME;
	    
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			conn = DriverManager.getConnection(URL, USERNAME, PASSWORD);
		} catch(Exception e){
			e.printStackTrace();
		}
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException
	{
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		
		out.println("Handled GET request");
	}
	
	@SuppressWarnings("unchecked")
	public void doPost(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException
	{
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();


		BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
		String data = URLDecoder.decode(br.readLine(), "UTF-8");

		JSONObject json = null;
		try {
			json = (JSONObject)new JSONParser().parse(data);
		} catch (ParseException e) {
			e.printStackTrace();
		}

		String type = (String) json.get("type");
		JSONObject info = (JSONObject) json.get("info");
		String accountNumber = (String) info.get("account number");
		
		double amount = 0.0;

		out.println("type = " + type);
		out.println("account number = " + accountNumber);
		
		JSONObject returnedJSON = new JSONObject();
		switch (type){
			case "balance":
				returnedJSON = getBalance(accountNumber);
				break;
			case "debit":
				amount = (Double) info.get("amount");
				returnedJSON = debit(accountNumber, amount);
				break;
			case "credit":
				amount = (Double) info.get("amount");
				returnedJSON = credit(accountNumber, amount);
				break;
			case "history":
				int numDays = (Integer) info.get("day range");
				returnedJSON = getHistory(accountNumber, numDays);
				break;
		}
		
		out.println(returnedJSON.toJSONString());

		
	}
	
	@SuppressWarnings("unchecked")
	public JSONObject getBalance(String accountNumber){
		JSONObject account = new JSONObject();
		
		try{
			if(conn.isClosed()) conn = DriverManager.getConnection(URL, USERNAME, PASSWORD);
			Statement st = conn.createStatement();

			String tableName = "account";
			List<String> fields = new ArrayList<String>();
			fields.add("balance");
			if(accountNumber.length() > 10) {
				tableName = "credit_account";
				fields.add("limit");
			}
			
			String query = "SELECT ";
			for(int i = 0; i < fields.size(); i++){
				query += fields.get(i) + " ";
			}
			query += "FROM " + tableName + " WHERE number = '" + accountNumber + "';";
			
			ResultSet rs = st.executeQuery(query);
			
			while(rs.next()){
				for(int i = 0; i < fields.size(); i++){
					account.put(fields.get(0), rs.getString(fields.get(0)));
				}
			}

			
		} catch(Exception e){
			e.printStackTrace();
		} 
		
		return account;
	}
	
	public JSONObject debit(String accountNumber, double amount){
		return null;
	}
	
	public JSONObject credit(String accountNumber, double amount){
		return null;
	}
	
	public JSONObject getHistory(String accountNumber, int numDays){
		return null;
	}
}


