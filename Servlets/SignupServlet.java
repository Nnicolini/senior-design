import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.security.MessageDigest;
import java.security.SecureRandom;
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

public class SignupServlet extends HttpServlet{

	private static final long serialVersionUID = 2702524403574618124L;
	//Length 10 to get a 16 character long salt
	private static final int SALT_LENGTH = 10;

	private static final String URL = "jdbc:mysql://128.4.26.194:3306/";
	private static final String DBNAME = "kaboom";
	private static final String USERNAME = "root";
	private static final String PASSWORD = "";

	private static Connection conn = null;

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
		String user = URLDecoder.decode(request.getParameter("username"), "UTF-8");
		String pass = URLDecoder.decode(request.getParameter("password"), "UTF-8");

		response.setContentType("application/json");
		PrintWriter out = response.getWriter();

		byte[] saltBytes = new byte[SALT_LENGTH];
		SecureRandom sr = new SecureRandom();
		sr.nextBytes(saltBytes);
		String salt = Base64.encodeBase64String(saltBytes);
		
		try{
			MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
			String saltedPass = pass + salt;
			sha256.update(saltedPass.getBytes("UTF-8"));
			byte[] digest = sha256.digest();
			String hashedPass = Base64.encodeBase64String(digest);


			Statement st = conn.createStatement();	

			//Check if username is already taken
			ResultSet rs = st.executeQuery("SELECT id, username, password, salt FROM users WHERE username LIKE '" + user + "';");

			if(rs.next()){
				response.sendError(401);
			} 
			else{
				st = conn.createStatement();
				st.executeUpdate("INSERT INTO users(username, password, salt) VALUES('"+user+"','"+hashedPass+"','"+salt+"');");

				st = conn.createStatement();
				rs = st.executeQuery("SELECT id, username, password, salt FROM users WHERE username LIKE '" + user + "';");
				if(rs.next()){
					int id = rs.getInt("id");
					out.println("{\"id\" : "+ id + ", " + "\"username\" : \""+ user +"\"}");
				}
			}

			st.close();

		} catch(Exception e){
			e.printStackTrace();
			out.println("Exception e - " + e.getMessage());
			StackTraceElement[] ste = e.getStackTrace();
			for(int i = 0; i < ste.length; i++){
				out.println(ste[i]);
			}
		}
	}
	
	public void destroy(){
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}