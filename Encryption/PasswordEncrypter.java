
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.apache.commons.codec.binary.Base64;

public class PasswordEncrypter {
	
	private String hashAlgorithmName; //"SHA-256"

	public PasswordEncrypter(String hashAlgorithmName){
		this.hashAlgorithmName = hashAlgorithmName;
	};
	
	
	public String encode(String pass, String salt){
		String encryptedPass = "";
		String saltedPass = pass + salt;
		
		MessageDigest md;
		try {
			md = MessageDigest.getInstance(hashAlgorithmName);
			md.update(saltedPass.getBytes("UTF-8"));
			
			byte[] digest = md.digest();
			encryptedPass = Base64.encodeBase64String(digest);
			
		} catch (NoSuchAlgorithmException | UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		
		return encryptedPass;
	}
}