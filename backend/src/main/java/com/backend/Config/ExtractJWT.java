package com.backend.Config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;

import java.io.InputStream;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class ExtractJWT {

	private static PublicKey publicKey;

	static {
		try {
			InputStream inputStream = ExtractJWT.class.getClassLoader().getResourceAsStream("certs/public.pem");

			if (inputStream == null) {
				throw new IllegalArgumentException("Public key file not found");
			}

			String publicKeyPEM = new String(inputStream.readAllBytes()).replace("-----BEGIN PUBLIC KEY-----", "")
				.replace("-----END PUBLIC KEY-----", "")
				.replaceAll("\\s", "");

			byte[] encoded = Base64.getDecoder().decode(publicKeyPEM);

			KeyFactory keyFactory = KeyFactory.getInstance("RSA");
			X509EncodedKeySpec keySpec = new X509EncodedKeySpec(encoded);
			publicKey = keyFactory.generatePublic(keySpec);

		}
		catch (Exception e) {
			throw new RuntimeException("Failed to load public key", e);
		}
	}

	public static Long getUserId(String token) throws Exception {
		try {
			// Remove "Bearer " prefix if present
			if (token.startsWith("Bearer ")) {
				token = token.substring(7);
			}

			// Parse the JWT using the RSA public key
			Jws<Claims> claimsJws = Jwts.parser().setSigningKey(publicKey).parseClaimsJws(token);

			// Extract userId from payload
			Claims claims = claimsJws.getBody();
			Object userIdClaim = claims.get("userId");

			if (userIdClaim instanceof Integer) {
				return ((Integer) userIdClaim).longValue();
			}
			else if (userIdClaim instanceof Long) {
				return (Long) userIdClaim;
			}
			else {
				throw new IllegalArgumentException("Invalid userId type in token");
			}

		}
		catch (Exception e) {
			throw new Exception("Failed to extract userId from token: " + e.getMessage());
		}
	}

}
