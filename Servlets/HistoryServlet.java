import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

public class HistoryServlet extends HttpServlet{

	private static final long serialVersionUID = 2702524403574618123L;
		
	private static final String URL = "jdbc:mysql://128.4.26.235:3306/";
	private static final String DBNAME = "kaboom";
	private static final String USERNAME = "root";
	private static final String PASSWORD = "";

	private static Connection conn = null;
	
	//POJO History class
	private class History {
		int id;
		String account_number;
		String transaction_type;
		double amount;
		Timestamp datetime;
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
		String account_number = URLDecoder.decode(request.getParameter("number"), "UTF-8");

		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		
		ArrayList<History> history = new ArrayList<History>();

		Statement st;
		ResultSet rs;
		
		try{
			st = conn.createStatement();
			rs = st.executeQuery("SELECT * FROM history WHERE account_number = " + account_number + ";");
			
			while(rs.next()){
				History h = new History();
				h.id = rs.getInt("id");
				h.account_number = rs.getString("account_number");
				h.transaction_type = rs.getString("transaction_type");
				h.amount = rs.getDouble("amount");
				h.datetime = rs.getTimestamp("datetime");
				history.add(h);
			}
			
			Gson gson = new Gson();
			StringBuilder sb = new StringBuilder();
			sb.append("{\"history\":[");
			for(int i = 0; i < history.size(); i++){
				sb.append(gson.toJson(history.get(i)));
				if(i != history.size()-1) sb.append(",");
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