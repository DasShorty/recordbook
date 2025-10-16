package de.dasshorty.recordbook.authentication.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class JwtAuthenticationProvider implements org.springframework.security.authentication.AuthenticationProvider {

    private final JwtHandler jwtHandler;

    public JwtAuthenticationProvider(JwtHandler jwtHandler) {
        this.jwtHandler = jwtHandler;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        String token = (String) authentication.getCredentials();

        try {
            if (token != null && this.jwtHandler.checkAccessToken(token) && this.jwtHandler.isTokenSigned(token)) {
                Optional<UUID> optional = this.jwtHandler.extractUserId(token);

                return optional.map(uuid -> new UsernamePasswordAuthenticationToken(uuid.toString(), token, this.jwtHandler.extractScopes(token))).orElse(
                        null);

            }
        } catch (ExpiredJwtException e) {
            return null;
        }

        return null;
    }


    @Override
    public boolean supports(Class<?> authentication) {
        return JwtAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
