import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

public class AccountServlet extends HttpServlet{

	private static final long serialVersionUID = 2702524403574618123L;
		
	private static final String URL = "jdbc:mysql://128.4.26.235:3306/";
	private static final String DBNAME = "kaboom";
	private static final String USERNAME = "root";
	private static final String PASSWORD = "";

	private static Connection conn = null;
	
	//POJO Account class
	private class Account {
		int id;
		String number;
		double balance;
		String name;
		String type;
		double interest_rate;
	}
	
	public void init() throws ServletException{
		try{
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			conn = DriverManager.getConnection(URL + DBNAME, USERNAME, PASSWORD);
		} catch(Exception e){
			e.printStackTrace();
		}
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException
	{
		String user_id = URLDecoder.decode(request.getParameter("id"), "UTF-8");

		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		
		ArrayList<Account> accounts = new ArrayList<Account>();
		
		try{
			Statement st = conn.createStatement();
			ResultSet rs = st.executeQuery("SELECT * FROM accounts WHERE user_id = " + user_id + ";");
			
			while(rs.next()){
				Account account = new Account();
				account.id = rs.getInt("id");
				account.number = rs.getString("number");
				account.balance = rs.getDouble("balance");
				account.name = rs.getString("name");
				account.type = rs.getString("type");
				account.interest_rate = rs.getDouble("interest_rate");
				accounts.add(account);
			}
			
			Gson gson = new Gson();
			StringBuilder sb = new StringBuilder();
			sb.append("{\"accounts\":[");
			for(int i = 0; i < accounts.size(); i++){
				sb.append(gson.toJson(accounts.get(i)));
				if(i != accounts.size()-1) sb.append(",");
			}
			sb.append("]}");

			out.println(sb.toString());
			
		} catch(Exception e){
			e.printStackTrace();
			out.println("Exception e - " + e.getMessage());
			StackTraceElement[] ste = e.getStackTrace();
			for(int i = 0; i < ste.length; i++){
				out.println(ste[i]);
			}
		}
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException
	{
		doGet(request, response);
	}
	
	public void destroy(){
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
