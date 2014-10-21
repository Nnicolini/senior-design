import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import java.net.URLEncoder;
import java.net.URLDecoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class MyServlet extends HttpServlet{

	private static final long serialVersionUID = 2702524403574618123L;

	static Connection conn = null;
	static Statement st = null;
	
	static final String URL = "jdbc:mysql://128.4.26.235:3306/";
	static final String DBNAME = "kaboom";
	static final String USERNAME = "root";
	static final String PASSWORD = "";
	
	public void init() throws ServletException{
		try{
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			conn = DriverManager.getConnection(URL + DBNAME, USERNAME, PASSWORD);
			st = conn.createStatement();
		} catch(Exception e){
			e.printStackTrace();
		}
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException
	{
		String user = URLDecoder.decode(request.getParameter("username"), "UTF-8");
		String pass = URLDecoder.decode(request.getParameter("password"), "UTF-8");

		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		
		try{
			ResultSet rs = st.executeQuery("SELECT id, username, password FROM users WHERE username LIKE '" 
				+ user + "' AND password LIKE '" + pass + "';");

			if(rs.next()){
				out.println("{\"id\" : "+ rs.getInt("id") + ", " +
					"\"username\" : \""+ rs.getString("username") +"\", " +
					"\"password\" : \""+ rs.getString("password") + "\"}");
			}
			else{
				out.println("{}");
			}

			
		} catch(Exception e){
			e.printStackTrace();
			out.println("Exception e - " + e.getMessage());
			StackTraceElement[] ste = e.getStackTrace();
			for(int i = 0; i < ste.length; i++){
				out.println("<br>" + ste[i]);
			}
		}
	}
	
	public void destroy(){
		try {
			st.close();
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}
