
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.security.SecureRandom;
import java.sql.Date;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import password.PasswordEncrypter;

public class RandomSQLQueryTextFileGenerator {

	//Alphabets
	private static final String ALPHA = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	private static final String ALPHANUMERIC = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	private static final String NUMERIC = "1234567890";
	//ASCII characters 32-126
	private static final String ASCII = " !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
	//Remove some of the ASCII characters that used in SQL syntax '"\
	private static final String MYALPHABET = " !#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";

	//Name of the hashing algorithm used by the password encryptor
	private static final String hashAlgorithmName = "SHA-256";

	//Name of the file to store the generated SQL commands
	private static final String FILENAME = "generated_data.sql";

	//Different account types
	private static final String[] accountTypes = {"Checking", "Savings", "Credit"};

	//Timestamp range for expiration dates
	private static final long beginTime = Timestamp.valueOf("2015-06-01 00:00:00").getTime();
	private static final long endTime = Timestamp.valueOf("2020-01-01 00:00:00").getTime();

	//Number of ____ to create
	private static final int NUMUSERS = 1000;
	private static final int NUMACCOUNTS = 5000;


	private static SecureRandom rand;
	private static PasswordEncrypter pe;

	public RandomSQLQueryTextFileGenerator() {
		rand = new SecureRandom();
		pe = new PasswordEncrypter("SHA-256");
	}

	/**
	 * Generates an integer number of INSERT statements to
	 * create new users with a 4-15 length username,
	 * 4-20 length password, 16 character salt value and
	 * then creates an encrypted 44 character password
	 * to be stored in the database.
	 *
	 * @param numberOfUsers The number of users
	 * @return void all content is written out to a file
	 */
	public void generateRandomizedUsers(int numberOfUsers){
		String startFormat = "INSERT INTO user(`username`, `password`, `salt`) VALUES(";
		List<String> lines = new ArrayList<String>();
		List<String> secretLines = new ArrayList<String>();

		for(int i = 0; i < numberOfUsers; i++){
			//Generate random username
			StringBuilder sb = new StringBuilder();

			//username must at least be 4 characters and no more than 15
			int usernameLength = randInt(4, 15);
			for(int j = 0; j < usernameLength; j++){
				int index = randInt(0, ALPHANUMERIC.length()-1);
				sb.append(ALPHANUMERIC.charAt(index));
			}
			String username = sb.toString();


			//Generate random password
			sb.setLength(0);

			int passwordLength = randInt(4, 20);
			for(int j = 0; j < passwordLength; j++){
				int index = randInt(0, MYALPHABET.length()-1);
				sb.append(MYALPHABET.charAt(index));
			}
			String password = sb.toString();

			//Generate 16 character salt
			sb.setLength(0);

			int saltLength = 16;
			for(int j = 0; j < saltLength; j++){
				int index = randInt(0, MYALPHABET.length()-1);
				sb.append(MYALPHABET.charAt(index));
			}
			String salt = sb.toString();

			//Generate actual hashed password
			String hashedPass = pe.encode(password, salt);

			//Piece together actual SQL line
			sb.setLength(0);
			sb.append(startFormat);
			sb.append("'" + username + "'");
			sb.append(", '" + hashedPass + "'");
			sb.append(", '" + salt + "'");
			sb.append(");");

			lines.add(sb.toString());
			secretLines.add(username + " : " + password);
		}

		writeLinesToFile(FILENAME, lines, false);
		writeLinesToFile("generated_user_pass.txt", secretLines, false);

	}

	/**
	 * Generates an integer number of INSERT statements to
	 * create cash accounts for randomized user_id's
	 *
	 * @param numberOfAccounts The number of accounts
	 * @return void all content is written out to a file
	 */
	public void generateRandomizedAccounts(int numberOfAccounts){
		String startFormat = "INSERT INTO account(`user_id`, `account_type_id`, `number`, "
				+ "`name`, `interest_rate`, `balance`, `overdraft`) VALUES(";
		List<String> lines = new ArrayList<String>();

		//Create HashMap to hold all created account numbers
		//Key: account number, Value: count (1)
		HashMap<String, Integer> accounts = new HashMap<String, Integer>();

		//Insert all manual_data account numbers (so that duplicates will not be generated)
		accounts.put("1111111111", 1);
		accounts.put("1111111112", 1);
		accounts.put("1111111113", 1);
		accounts.put("1111111114", 1);
		accounts.put("1111111115", 1);

		for(int i = 0; i < numberOfAccounts; i++){
			//Generate random user id (not including 1 which is the test account)
			int user_id = randInt(2, NUMUSERS+1);


			//Generate random account_type_id (Checking, Savings)
			int account_type_id = randInt(1, 2);


			//Generate random (unique) account number
			String number = generateAccountNumber(10);
			while(accounts.containsKey(number)) number = generateAccountNumber(10);
			accounts.put(number, 1);


			//Generate random name
			StringBuilder sb = new StringBuilder();
			int nameLength = (int) Math.round(Math.random() * Math.random() * 50); //2 Math.random() doubles for a lower random number
			for(int j = 0; j < nameLength; j++){
				int index = randInt(0, ALPHANUMERIC.length()-1);
				sb.append(ALPHANUMERIC.charAt(index));
			}
			String name = sb.toString();


			//Generate random account interest rate
			double randomNumber = Math.random();
			for(int j = 0; j < 7; j++){ //7 is just a random number I choose that gives a seemingly normal random interest rate
				randomNumber *= Math.random();
			}
			double interest_rate = randomNumber * 100;
			interest_rate = Math.round(interest_rate * 10000.0) / 10000.0; //4 decimal places


			//Generate random balance
			double balance = Math.random() * Math.random() * 10000; //2 Math.random() doubles for a lower random number
			balance = Math.round(balance * 100.0) / 100.0; //2 decimal places


			//Generate overdraft (always starts at 0.00)
			double overdraft = 0.00;


			sb = new StringBuilder();
			sb.append(startFormat);
			sb.append(user_id);
			sb.append(", " + account_type_id);
			sb.append(", '" + number + "'");
			sb.append(", '" + name + "'");
			sb.append(", " + interest_rate);
			sb.append(", " + balance);
			sb.append(", " + overdraft);
			sb.append(");");

			lines.add(sb.toString());
			lines.add("INSERT INTO history(transaction_type_id, account_number, amount, datetime) VALUES(7, '" + number + "', 0.00, NOW());");
		}

		writeLinesToFile(FILENAME, lines, true);

	}


	/**
	 * Generates an integer number of INSERT statements to
	 * create credit accounts for randomized user_id's
	 *
	 * @param numberOfAccounts The number of accounts
	 * @return void all content is written out to a file
	 */
	public void generateRandomizedCreditAccounts(int numberOfAccounts){
		String startFormat = "INSERT INTO credit_account(`user_id`, `account_type_id`, `number`, "
				+ "`cvv`, `name`, `expiry_date`, `balance`, `limit`) VALUES(";
		List<String> lines = new ArrayList<String>();

		//Create HashMap to hold all created account numbers
		//Key: account number, Value: count (1)
		HashMap<String, Integer> accounts = new HashMap<String, Integer>();

		//Insert all manual_data account numbers
		accounts.put("1111111111111111", 1);
		accounts.put("1111111111111112", 1);

		for(int i = 0; i < numberOfAccounts; i++){
			//Generate random user id (not including 1 which is the test account)
			int user_id = randInt(2, NUMUSERS+1);


			//Generate account_type_id (3 is credit)
			int account_type_id = 3;


			//Generate random account number
			String number = generateAccountNumber(16);
			while(accounts.containsKey(number)) number = generateAccountNumber(16);
			accounts.put(number, 1);


			//Generate random cvv (3 digit card verification value)
			StringBuilder sb = new StringBuilder();
			for(int j = 0; j < 3; j++){
				int index = randInt(0, NUMERIC.length()-1);
				sb.append(NUMERIC.charAt(index));
			}
			String cvv = sb.toString();


			//Generate random name
			sb = new StringBuilder();
			int nameLength = (int) Math.round(Math.random() * Math.random() * 50); //2 Math.random() doubles for a lower random number
			for(int j = 0; j < nameLength; j++){
				int index = randInt(0, ALPHANUMERIC.length()-1);
				sb.append(ALPHANUMERIC.charAt(index));
			}
			String name = sb.toString();


			//Generate expiry date
			Date randomDate = new Date(getRandomTimeBetweenTwoDates());
			String expiry_date = randomDate.toString();


			//Generate random limit ($1000 increments)
			int multiplier = randInt(1, 50);
			double limit = multiplier * 1000.0;


			//Generate random balance
			double balance = Math.random() * Math.random() * limit; //2 Math.random() doubles for a lower random number
			balance = Math.round(balance * 100.0) / 100.0; //2 decimal places


			//Piece together actual SQL line
			sb = new StringBuilder();
			sb.append(startFormat);
			sb.append(user_id);
			sb.append(", " + account_type_id);
			sb.append(", '" + number + "'");
			sb.append(", '" + cvv + "'");
			sb.append(", '" + name + "'");
			sb.append(", '" + expiry_date + "'");
			sb.append(", " + balance);
			sb.append(", " + limit);
			sb.append(");");

			lines.add(sb.toString());
			lines.add("INSERT INTO history(transaction_type_id, account_number, amount, datetime) VALUES(7, '" + number + "', 0.00, NOW());");
		}

		writeLinesToFile(FILENAME, lines, true);
	}


	//Generates a random account number of specified length
	public String generateAccountNumber(int length){
		StringBuilder sb = new StringBuilder();
		for(int j = 0; j < length; j++){
			int index = randInt(0, NUMERIC.length()-1);
			sb.append(NUMERIC.charAt(index));
		}
		String number = sb.toString();

		return number;
	}


	//Generates a random number to represent a time between the two dates (beginTime, endTime)
	//http://www.leveluplunch.com/java/examples/generate-random-date/
	private long getRandomTimeBetweenTwoDates () {
	    long diff = endTime - beginTime + 1;
	    return beginTime + (long) (Math.random() * diff);
	}


	/**
	 * Returns a pseudo-random number between min and max, inclusive.
	 * The difference between min and max can be at most
	 * <code>Integer.MAX_VALUE - 1</code>.
	 *
	 * @param min Minimum value
	 * @param max Maximum value.  Must be greater than min.
	 * @return Integer between min and max, inclusive.
	 * @see java.util.Random#nextInt(int)
	 */
	public int randInt(int min, int max){
		int randNum = rand.nextInt((max - min) + 1) + min;
		return randNum;
	}

	//Writes a List of String lines out to the file specified above
	public void writeLinesToFile(String fileName, List<String> lines, boolean appendFlag){
		File file = new File(fileName);

		try {
			if (!file.exists()){
				file.createNewFile();
			}

			//Boolean true is to set the "append" flag
			FileWriter fw = new FileWriter(file.getAbsoluteFile(), appendFlag);
			BufferedWriter bw = new BufferedWriter(fw);
			bw.write("\n");
			for(int i = 0; i < lines.size(); i++){
				bw.write(lines.get(i) + "\n");
			}
			bw.close();

		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public static void main(String[] args){
		long lStartTime = System.currentTimeMillis();
		RandomSQLQueryTextFileGenerator rg = new RandomSQLQueryTextFileGenerator();

		rg.generateRandomizedUsers(NUMUSERS);
		rg.generateRandomizedAccounts(NUMACCOUNTS);
		rg.generateRandomizedCreditAccounts(NUMACCOUNTS);

		long lEndTime = System.currentTimeMillis();
		long elapsedTime = lEndTime - lStartTime;
		double seconds = (elapsedTime*1.0)/1000;
		System.out.println("Complete in " + seconds + " seconds");
	}

}
