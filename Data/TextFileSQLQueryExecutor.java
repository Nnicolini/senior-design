import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

public class TextFileSQLQueryExecutor {

	/**
	 * DISCLAIMER:
	 * 		Running this program is much slower than just simply transfering the .sql file
	 * 		to the destination and importing it with mysql -u X -p X < .sql
	 */

	private static String URL;
	private static String HOST;
	private static String PORT;
	private static String DBNAME;
	private static String USERNAME;
	private static String PASSWORD;
	
	private static final String PROPERTIESFILENAME = "db.properties";
	
	private static Connection conn;
	
	public TextFileSQLQueryExecutor (){
		Properties properties = new Properties();
		InputStream inputStream = getClass().getClassLoader().getResourceAsStream(PROPERTIESFILENAME);
		
		try {
			properties.load(inputStream);
			
			HOST = properties.getProperty("host");
			PORT = properties.getProperty("port");
		    DBNAME = properties.getProperty("dbname");
		    USERNAME = properties.getProperty("username");
		    PASSWORD = properties.getProperty("password");
		    
		    URL = "jdbc:mysql://" + HOST + ":" + PORT + "/" + DBNAME;
		    
		    System.out.println(URL);
	    
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			conn = DriverManager.getConnection(URL, USERNAME, PASSWORD);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	public void executeFile(String fileName){
		BufferedReader br = null;
		Statement st = null;
		
		try {
			st = conn.createStatement();
			
			String currentLine;
			br = new BufferedReader(new FileReader(fileName));
			
			while((currentLine = br.readLine()) != null){
				System.out.println(currentLine);
				if(!currentLine.isEmpty()){
					if(currentLine.substring(0, 11).compareTo("INSERT INTO") == 0){
						st.executeUpdate(currentLine);
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (br != null) br.close();
				if (st != null) st.close();
			} catch (IOException | SQLException ex) {
				ex.printStackTrace();
			}
		}
		
		
	}
	
	public static void main(String[] args) {
		long lStartTime = System.currentTimeMillis();
		TextFileSQLQueryExecutor t = new TextFileSQLQueryExecutor();
		
		t.executeFile("generated_data.sql");
		
		long lEndTime = System.currentTimeMillis();
		long elapsedTime = lEndTime - lStartTime;
		double seconds = (elapsedTime*1.0)/1000;
		System.out.println("Complete in " + seconds + " seconds");
		
		if (conn != null){
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}

}
