import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.security.MessageDigest;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;

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
			ResultSet rs = st.executeQuery("SELECT id, username, password, salt FROM users WHERE username LIKE '" + user + "';");

			if(rs.next()){
				int id = rs.getInt("id");
				String username = rs.getString("username");
				String storedPass = rs.getString("password");
				String salt = rs.getString("salt");

				MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
				String saltedPass = pass + salt;
				sha256.update(saltedPass.getBytes("UTF-8"));
				byte[] digest = sha256.digest();
				
				String hashedPass = Base64.encodeBase64String(digest);
				
				if(storedPass.compareTo(hashedPass) == 0){
					out.println("{\"id\" : "+ id + ", " +
							"\"username\" : \""+ username +"\", " +
							"\"password\" : \""+ storedPass + "\"}");
				}
				else{
					out.println("{}");
				}

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