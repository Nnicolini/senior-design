
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class TextFileSQLQueryExecutor {

	private static final String URL = "jdbc:mysql://128.4.26.194:3306/";
	private static final String DBNAME = "kaching";
	private static final String USERNAME = "root";
	private static final String PASSWORD = "";
	
	private static final String FILENAME = "/Data/generated_data.txt";
	
	
	public static void main(String[] args) {
		
		BufferedReader br = null;
		Connection conn = null;
		Statement st = null;
		
		try{
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			conn = DriverManager.getConnection(URL + DBNAME, USERNAME, PASSWORD);
			st = conn.createStatement();
		} catch(SQLException | ClassNotFoundException | InstantiationException | IllegalAccessException e){
			e.printStackTrace();
		}
		
		try {
			String currentLine;
			br = new BufferedReader(new FileReader(FILENAME));
			
			while((currentLine = br.readLine()) != null){
				System.out.println(currentLine);
				if(currentLine.substring(0, 11).compareTo("INSERT INTO") == 0) st.executeUpdate(currentLine);
			}
			
		} catch (IOException | SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				if (br != null) br.close();
				if (st != null) st.close();
				if (conn != null) conn.close();
			} catch (IOException | SQLException ex) {
				ex.printStackTrace();
			}
		}
		
	}

}