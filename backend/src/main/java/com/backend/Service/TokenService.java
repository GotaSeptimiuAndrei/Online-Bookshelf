package com.backend.Service;

import com.backend.DTO.TokenResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TokenService {

	private final JwtEncoder encoder;

	private final UserService userService;

	public TokenService(JwtEncoder encoder, UserService userService) {
		this.encoder = encoder;
		this.userService = userService;
	}

	public TokenResponse generateToken(Authentication authentication) {
		Instant now = Instant.now();

		String username = authentication.getName();
		var user = userService.findByUsername(username)
			.orElseThrow(() -> new IllegalArgumentException("User not found"));

		List<String> roles = authentication.getAuthorities()
			.stream()
			.map(GrantedAuthority::getAuthority)
			.collect(Collectors.toList());

		JwtClaimsSet claims = JwtClaimsSet.builder()
			.issuer("self")
			.issuedAt(now)
			.expiresAt(now.plus(1, ChronoUnit.HOURS))
			.subject(authentication.getName())
			.claim("roles", roles)
			.claim("userId", user.getUserId())
			.build();

		return new TokenResponse(this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue());
	}

}
