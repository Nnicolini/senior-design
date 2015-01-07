import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class RandomSQLQueryTextFileGenerator {
	
	//Alphabets
	private static final String ALPHA = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	private static final String ALPHANUMERIC = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	private static final String NUMERIC = "1234567890";
	
	private static final String FILENAME = "/Data/generated_data.txt";
	
	private static final String[] accountTypes = {"Checking", "Savings"};
	
	
	public void generateRandomizedAccounts(int numberOfAccounts){
		String startFormat = "INSERT INTO accounts(user_id, number, balance, name, type, interest_rate) VALUES(";
		List<String> lines = new ArrayList<String>();
				
		for(int j = 0; j < numberOfAccounts; j++){
			//Generate random user id
			int user_id = 1; //all accounts tied to user "test"
					
			//Generate random account number
			StringBuffer sb = new StringBuffer();
			for(int i = 0; i < 10; i++){
				double index = Math.random() * NUMERIC.length();
				sb.append(NUMERIC.charAt((int) index));
			}
			String number = sb.toString();
			
			//Generate random account balance
			double balance = Math.random() * Math.random() * 10000; //2 Math.random() doubles for a lower random number
			balance = Math.round(balance * 100.0) / 100.0;
			
			//Generate random account name
			sb = new StringBuffer();
			int nameLength = (int) Math.round(Math.random() * Math.random() * 50); //2 Math.random() doubles for a lower random number
			for(int i = 0; i < nameLength; i++){
				double index = Math.random() * ALPHANUMERIC.length();
				sb.append(ALPHANUMERIC.charAt((int) index));
			}
			String name = sb.toString();
			
			//Generate random account type
			String type = accountTypes[(int) Math.floor(Math.random() * accountTypes.length)];
			
			//Generate random account interest rate
			double randomNumber = Math.random();
			for(int i = 0; i < 7; i++){ //7 is just a random number I choose that gives a seemingly normal random interest rate
				randomNumber *= Math.random();
			}
			double interest_rate = randomNumber * 100; 
			interest_rate = Math.round(interest_rate * 10000.0) / 10000.0;
			
			StringBuffer sb2 = new StringBuffer();
			sb2.append(startFormat);
			sb2.append(user_id);
			sb2.append(", '" + number + "'");
			sb2.append(", " + balance);
			sb2.append(", '" + name + "'");
			sb2.append(", '" + type + "'");
			sb2.append(", " + interest_rate);
			sb2.append(");");
			
			lines.add(sb2.toString());
		}	
		
		
		File file = new File(FILENAME);
		
		try {
			if (!file.exists()){
				file.createNewFile();
			}
			
			FileWriter fw = new FileWriter(file.getAbsoluteFile());
			BufferedWriter bw = new BufferedWriter(fw);
			for(int i = 0; i < lines.size(); i++){
				bw.write(lines.get(i) + "\n");
			}
			bw.close();
			
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
	
	public static void main(String[] args){
		RandomSQLQueryTextFileGenerator rg = new RandomSQLQueryTextFileGenerator();
		
		rg.generateRandomizedAccounts(10);

	}

}