package de.dasshorty.recordbook.authentication;

import de.dasshorty.recordbook.authentication.httpbodies.AuthenticationBody;
import de.dasshorty.recordbook.authentication.httpbodies.TokenBody;
import de.dasshorty.recordbook.user.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountNotFoundException;
import java.util.Optional;

@RestController
@RequestMapping("/authentication")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @GetMapping
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("test");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationBody body) {

        try {
            Pair<String, String> tokenPair = this.authenticationService.authenticate(body.email(), body.password());
            return ResponseEntity.ok(new TokenBody(tokenPair.getFirst(), tokenPair.getSecond()));
        } catch (BadCredentialsException | AccountNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @GetMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestHeader("Authorization") String authorizationHeader) {

        String bearer = authorizationHeader.replace("Bearer ", "");

        if (!this.authenticationService.isRefreshTokenValid(bearer)) {
            return ResponseEntity.badRequest().body("Invalid refresh token");
        }

        Optional<UserDto> optionalUserDto = this.authenticationService.obtainUserByToken(bearer);

        if (optionalUserDto.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        UserDto userDto = optionalUserDto.get();

        String accessToken = this.authenticationService.obtainAccessToken(userDto);

        return ResponseEntity.ok(new TokenBody(accessToken, bearer));
    }

}
