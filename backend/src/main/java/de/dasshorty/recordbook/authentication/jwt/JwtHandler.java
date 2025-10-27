package de.dasshorty.recordbook.authentication.jwt;

import de.dasshorty.recordbook.user.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
public class JwtHandler {

    private SecretKey secretKey;
    @Value("${jwt.secret}")
    private String SECRET_KEY;
    @Value("${jwt.access-token.expiration}")
    private int ACCESS_EXPIRATION_TIME;
    @Value("${jwt.refresh-token.expiration}")
    private int REFRESH_EXPIRATION_TIME;


    @PostConstruct
    private void init() {
        this.secretKey = this.generateSecretKey();
    }

    public SecretKey getSecretKey() {
        return secretKey;
    }

    private String mapAuthoritiesToScope(Collection<? extends GrantedAuthority> authorities) {

        StringBuilder scopeBuilder = new StringBuilder();

        authorities.forEach(authority -> {
            if (!scopeBuilder.isEmpty()) {
                scopeBuilder.append(",");
            }

            scopeBuilder.append(authority.getAuthority());
        });

        return scopeBuilder.toString();
    }

    private SecretKey generateSecretKey() {
        assert SECRET_KEY != null;
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(User user) {
        return Jwts.builder().subject(user.getId().toString()).issuedAt(new Date()).expiration(
                new Date(System.currentTimeMillis() + ACCESS_EXPIRATION_TIME * 1000L)).claim(
                "scp", this.mapAuthoritiesToScope(user.getAuthorities())).claim("type", "access_token").signWith(this.secretKey).compact();
    }

    public String generateRefreshToken(User user) {
        return Jwts.builder().subject(user.getId().toString()).issuedAt(new Date()).expiration(
                new Date(System.currentTimeMillis() + REFRESH_EXPIRATION_TIME * 1000L)).claim(
                "scp", this.mapAuthoritiesToScope(user.getAuthorities())).claim("type", "refresh_token").signWith(this.secretKey).compact();
    }

    public List<SimpleGrantedAuthority> extractScopes(String token) {

        JwtParser parser = Jwts.parser().verifyWith(this.getSecretKey()).build();
        Jws<Claims> claimsJws = parser.parseSignedClaims(token);
        Claims payload = claimsJws.getPayload();
        String scopes = payload.get("scp", String.class);

        return Arrays.stream(scopes.split(",")).map(SimpleGrantedAuthority::new).toList();
    }

    public Optional<UUID> extractUserId(String token) {
        JwtParser parser = Jwts.parser().verifyWith(this.getSecretKey()).build();
        Jws<Claims> claimsJws = parser.parseSignedClaims(token);
        Claims payload = claimsJws.getPayload();

        if (!payload.containsKey("sub")) {
            return Optional.empty();
        }

        return Optional.of(UUID.fromString(payload.getSubject()));
    }

    private boolean checkToken(Claims payload) {
        boolean issuedBefore = payload.getIssuedAt().before(new Date());
        boolean isNonExpired = payload.getExpiration().after(new Date());
        return issuedBefore && isNonExpired;
    }

    public Claims retrieveClaimsFromToken(String token) throws ExpiredJwtException {
        return Jwts.parser().verifyWith(this.getSecretKey()).build().parseSignedClaims(token).getPayload();
    }

    public boolean isTokenSigned(String token) {
        return Jwts.parser().verifyWith(this.getSecretKey()).build().isSigned(token);
    }

    public boolean checkRefreshToken(String token) throws ExpiredJwtException {
        Claims payload = this.retrieveClaimsFromToken(token);
        return Objects.equals(payload.get("type", String.class), "refresh_token") && checkToken(payload);
    }

    public boolean checkAccessToken(String token) throws ExpiredJwtException {
        Claims payload = this.retrieveClaimsFromToken(token);
        return Objects.equals(payload.get("type", String.class), "access_token") && checkToken(payload);
    }


}
