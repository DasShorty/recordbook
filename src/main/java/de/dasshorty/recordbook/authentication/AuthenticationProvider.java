package de.dasshorty.recordbook.authentication;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.*;

public class AuthenticationProvider implements org.springframework.security.authentication.AuthenticationProvider {

    private final JwtHandler jwtHandler;

    public AuthenticationProvider(JwtHandler jwtHandler) {
        this.jwtHandler = jwtHandler;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        String token = (String) authentication.getCredentials();

        if (token != null && checkToken(token)) {
            Optional<UUID> optional = this.extractUserId(token);

            return optional.map(uuid -> new UsernamePasswordAuthenticationToken(uuid.toString(), token, this.extractScopes(token))).orElse(
                    null);

        }

        return null;
    }

    private List<SimpleGrantedAuthority> extractScopes(String token) {

        JwtParser parser = Jwts.parser().verifyWith(this.jwtHandler.getSecretKey()).build();
        Jws<Claims> claimsJws = parser.parseSignedClaims(token);
        Claims payload = claimsJws.getPayload();
        String scopes = payload.get("scp", String.class);

        return Arrays.stream(scopes.split(",")).map(SimpleGrantedAuthority::new).toList();
    }

    private Optional<UUID> extractUserId(String token) {
        JwtParser parser = Jwts.parser().verifyWith(this.jwtHandler.getSecretKey()).build();
        Jws<Claims> claimsJws = parser.parseSignedClaims(token);
        Claims payload = claimsJws.getPayload();

        if (!payload.containsKey("sub")) {
            return Optional.empty();
        }

        return Optional.of(UUID.fromString(payload.getSubject()));
    }

    private boolean checkToken(String token) {

        JwtParser parser = Jwts.parser().verifyWith(this.jwtHandler.getSecretKey()).build();
        Jws<Claims> claimsJws = parser.parseSignedClaims(token);
        Claims payload = claimsJws.getPayload();

        boolean isTokenDeclaredAsAccess = Objects.equals(payload.get("type", String.class), "access_token");
        boolean issuedBefore = payload.getIssuedAt().before(new Date());
        boolean isNonExpired = payload.getExpiration().after(new Date());

        return parser.isSigned(token) && isNonExpired && issuedBefore && isTokenDeclaredAsAccess;
    }


    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
