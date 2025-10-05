package de.dasshorty.recordbook.authentication;

import de.dasshorty.recordbook.user.UserDto;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Date;

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

    public String generateAccessToken(UserDto user) {
        return Jwts.builder().subject(user.getId().toString()).issuedAt(new Date()).expiration(
                new Date(System.currentTimeMillis() + ACCESS_EXPIRATION_TIME * 1000L)).claim(
                "scp", this.mapAuthoritiesToScope(user.getAuthorities())).claim("type", "access_token").signWith(this.secretKey).compact();
    }

    public String generateRefreshToken(UserDto user) {
        return Jwts.builder().subject(user.getId().toString()).issuedAt(new Date()).expiration(
                new Date(System.currentTimeMillis() + REFRESH_EXPIRATION_TIME * 1000L)).claim("type", "access_token").signWith(
                this.secretKey).compact();
    }


}
