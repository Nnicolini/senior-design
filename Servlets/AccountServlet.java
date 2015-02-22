import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

public class AccountServlet extends HttpServlet{

	private static final long serialVersionUID = 2702524403574618123L;
		
	private static final String URL = "jdbc:mysql://128.4.26.194:3306/";
	private static final String DBNAME = "kaching";
	private static final String USERNAME = "root";
	private static final String PASSWORD = "";

	private static Connection conn = null;
	
	//Account super class
	private abstract class Account {
		String number;
		String name;
		String type;
		double balance;
	}

	//POJO CashAccount class
	private class CashAccount extends Account{
		double interest_rate;
		double overdraft;
	}

	//POJO CreditAccount class
	private class CreditAccount extends Account{
		String cvv;
		String expiry_date;
		double limit;
	}
	
	public void init() throws ServletException{
		try{
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			conn = DriverManager.getConnection(URL + DBNAME, USERNAME, PASSWORD);
		} catch(Exception e){
			e.printStackTrace();
		}
	}
	
	//Used to get the list of all accounts associated with a given user_id
	public void doGet(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException
	{
		String user_id = URLDecoder.decode(request.getParameter("id"), "UTF-8");

		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		
		ArrayList<Account> cashAccounts = new ArrayList<Account>();
		ArrayList<Account> creditAccounts = new ArrayList<Account>();

		try{
			if(conn.isClosed()) conn = DriverManager.getConnection(URL + DBNAME, USERNAME, PASSWORD);
			Statement st = conn.createStatement();
			ResultSet rs = st.executeQuery("SELECT number, name, type, interest_rate, balance, overdraft " 
				+ "FROM account "
				+ "LEFT JOIN (account_type) ON (account_type.id = account_type_id) "
				+ "WHERE user_id = " + user_id + ";");
			
			while(rs.next()){
				CashAccount account = new CashAccount();
				account.number = rs.getString("number");
				account.name = rs.getString("name");
				account.type = rs.getString("type");
				account.interest_rate = rs.getDouble("interest_rate");
				account.balance = rs.getDouble("balance");
				account.overdraft = rs.getDouble("overdraft");
				cashAccounts.add(account);
			}
			
			Gson gson = new Gson();
			StringBuilder sb = new StringBuilder();
			sb.append("{\"cash_accounts\":[");
			for(int i = 0; i < cashAccounts.size(); i++){
				sb.append(gson.toJson(cashAccounts.get(i)));
				if(i != cashAccounts.size()-1) sb.append(",");
			}
			sb.append("], \"credit_accounts\":[");


			st = conn.createStatement();
			rs = st.executeQuery("SELECT number, cvv, name, type, expiry_date, balance, `limit` "
				+ "FROM credit_account "
				+ "LEFT JOIN (account_type) ON (account_type.id = account_type_id) "
				+ "WHERE user_id = " + user_id + ";");
			
			while(rs.next()){
				CreditAccount account = new CreditAccount();
				account.number = rs.getString("number");
				account.cvv = rs.getString("cvv");
				account.name = rs.getString("name");
				account.type = rs.getString("type");
				account.expiry_date = rs.getString("expiry_date");
				account.balance = rs.getDouble("balance");
				account.limit = rs.getDouble("limit");
				creditAccounts.add(account);
			}
			
			for(int i = 0; i < creditAccounts.size(); i++){
				sb.append(gson.toJson(creditAccounts.get(i)));
				if(i != creditAccounts.size()-1) sb.append(",");
			}
			sb.append("]}");

			out.println(sb.toString());

			rs.close();
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

	//Should be used to create a new CashAccount
	public void doPost(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException
	{
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		
		String user_id = request.getParameter("user_id");
		String number = request.getParameter("number");
		String name = request.getParameter("name");
		String type = request.getParameter("type");
		String balance = request.getParameter("balance");
		
		//Non-credit parameters
		String interest_rate = request.getParameter("interest_rate");
		String overdraft = request.getParameter("overdraft");

		//Credit parameters
		String cvv = request.getParameter("cvv");
		String expiry_date = request.getParameter("expiry_date");
		String limit = request.getParameter("limit");
		

		ArrayList<Account> cashAccounts = new ArrayList<Account>();

		try{
			if(conn.isClosed()) conn = DriverManager.getConnection(URL + DBNAME, USERNAME, PASSWORD);
			Statement st = conn.createStatement();
			st.executeUpdate("INSERT INTO account(user_id, account_type_id, number, name, interest_rate, balance, overdraft)" + 
				"VALUES("+user_id+", (SELECT id FROM account_type WHERE `type` = '" + type + "'),'"+number+"','"+name+"',"+interest_rate+","+balance+","+overdraft+");");

			st = conn.createStatement();
			ResultSet rs = st.executeQuery("SELECT number, name, type, interest_rate, balance, overdraft "
				+ "FROM account "
				+ "LEFT JOIN (account_type) ON (account_type.id = account_type_id) "
				+ "WHERE user_id = " + user_id + ";");
			
			while(rs.next()){
				CashAccount account = new CashAccount();
				account.number = rs.getString("number");
				account.name = rs.getString("name");
				account.type = rs.getString("type");
				account.interest_rate = rs.getDouble("interest_rate");
				account.balance = rs.getDouble("balance");
				account.overdraft = rs.getDouble("overdraft");
				cashAccounts.add(account);
			}
			
			Gson gson = new Gson();
			StringBuilder sb = new StringBuilder();
			sb.append("{\"accounts\":[");
			for(int i = 0; i < cashAccounts.size(); i++){
				sb.append(gson.toJson(cashAccounts.get(i)));
				if(i != cashAccounts.size()-1) sb.append(",");
			}
			sb.append("]}");

			out.println(sb.toString());

			rs.close();
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

	//Should be used to update a given CashAccount (deposit/withdraw)
	public void doPut(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException
	{
		BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
		String data = URLDecoder.decode(br.readLine(), "UTF-8");
		
		HashMap<String, String> parameters = new HashMap<String, String>();
		
		String[] params = data.split("&");
		for(int i = 0; i < params.length; i++){
			String[] pair = params[i].split("=");
			parameters.put(pair[0], pair[1]);
		}

		String number = parameters.get("number");
		String name = parameters.get("name");
		String type = parameters.get("type");
		String balance = parameters.get("balance");
		
		//Non-credit parameters
		String interest_rate = parameters.get("interest_rate");
		String overdraft = parameters.get("overdraft");

		//Credit parameters
		String cvv = parameters.get("cvv");
		String expiry_date = parameters.get("expiry_date");
		String limit = parameters.get("limit");

		response.setContentType("application/json");
		PrintWriter out = response.getWriter();

		out.println(data);

		ArrayList<Account> accounts = new ArrayList<Account>();

		try{
			if(conn.isClosed()) conn = DriverManager.getConnection(URL + DBNAME, USERNAME, PASSWORD);
			Statement st = conn.createStatement();
			st.executeUpdate("UPDATE accounts "
				+ "SET balance="+balance+", name='"+name+"', type='"+type+"', interest_rate="+interest_rate+" " 
				+ "WHERE number='"+number+"';");

			st = conn.createStatement();
			ResultSet rs = st.executeQuery("SELECT * FROM account WHERE number = '"+number+"';");
			
			while(rs.next()){
				CashAccount account = new CashAccount();
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

			rs.close();
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

	//Should be used to delete a given CashAccount by number
	public void doDelete(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException
	{
		String number = URLDecoder.decode(request.getParameter("number"), "UTF-8");

		response.setContentType("application/json");
		PrintWriter out = response.getWriter();

		try{
			if(conn.isClosed()) conn = DriverManager.getConnection(URL + DBNAME, USERNAME, PASSWORD);
			Statement st = conn.createStatement();
			st.executeUpdate("DELETE FROM account WHERE number='"+number+"';");
			
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
