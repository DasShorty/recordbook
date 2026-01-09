package de.dasshorty.recordbook.authentication;

import de.dasshorty.recordbook.authentication.jwt.JwtHandler;
import de.dasshorty.recordbook.user.User;
import de.dasshorty.recordbook.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountNotFoundException;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthenticationService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtHandler jwtHandler;

    @Autowired
    public AuthenticationService(UserService userService, PasswordEncoder passwordEncoder, JwtHandler jwtHandler) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtHandler = jwtHandler;
    }

    public boolean isRefreshTokenValid(String refreshToken) {
        return this.jwtHandler.checkRefreshToken(refreshToken) && this.jwtHandler.isTokenSigned(refreshToken);
    }

    public Pair<String, String> authenticate(String email, String password) throws AccountNotFoundException, BadCredentialsException {

        Optional<User> optionalUserDto = this.userService.retrieveUserByEmail(email);

        if (optionalUserDto.isEmpty()) {
            throw new AccountNotFoundException("Invalid email");
        }

        User user = optionalUserDto.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        String accessToken = this.obtainAccessToken(user);
        String refreshToken = this.obtainRefreshToken(user);

        return Pair.of(accessToken, refreshToken);
    }

    public Optional<User> obtainUserByToken(String token) {
        Optional<UUID> optionalId = this.jwtHandler.extractUserId(token);

        if (optionalId.isEmpty()) {
            return Optional.empty();
        }

        return this.userService.retrieveUserEntityById(optionalId.get());
    }

    protected String obtainAccessToken(User user) {
        return this.jwtHandler.generateAccessToken(user);
    }

    protected String obtainRefreshToken(User user) {
        return this.jwtHandler.generateRefreshToken(user);
    }
}
