package de.dasshorty.recordbook.authentication;

import de.dasshorty.recordbook.authentication.httpbodies.AuthenticationBody;
import de.dasshorty.recordbook.http.result.ErrorResult;
import de.dasshorty.recordbook.user.UserDto;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountNotFoundException;
import java.time.Duration;
import java.util.Optional;

@RestController
@RequestMapping("/authentication")
public class AuthenticationController {

    private final String SAME_SITE = "Lax";
    private final AuthenticationService authenticationService;
    @Value("${http.cookie.secure}")
    boolean secureHttpCookies;
    @Value("${http.cookie.accessToken.lifespan}")
    private long accessTokenLifespan;
    @Value("${http.cookie.refreshToken.lifespan}")
    private long refreshTokenLifespan;
    @Value("${http.cookie.domain}")
    private String cookieDomain;

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationBody body, HttpServletResponse response) {

        try {
            Pair<String, String> tokenPair = this.authenticationService.authenticate(body.email(), body.password());
            this.setTokenCookies(response, tokenPair.getFirst(), tokenPair.getSecond());

            Optional<UserDto> optional = this.authenticationService.obtainUserByToken(tokenPair.getSecond());

            if (optional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("account no found", "no matching id in refreshToken"));
            }

            return ResponseEntity.ok().body(optional.get().transformToBody());
        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body(new ErrorResult("bad credentials", "req-body"));
        } catch (AccountNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("account not found", "req-body"));
        }

    }

    @GetMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@CookieValue(name = "refresh_token", required = false) String refreshToken, HttpServletResponse response) {

        if (!this.authenticationService.isRefreshTokenValid(refreshToken)) {
            return ResponseEntity.badRequest().body("Invalid refresh token");
        }

        Optional<UserDto> optionalUserDto = this.authenticationService.obtainUserByToken(refreshToken);

        if (optionalUserDto.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        UserDto userDto = optionalUserDto.get();
        String accessToken = this.authenticationService.obtainAccessToken(userDto);

        this.setTokenCookies(response, accessToken, refreshToken);
        return ResponseEntity.ok().body(userDto.transformToBody());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        this.expireTokenCookies(response);
        return ResponseEntity.ok().build();
    }

    private void setTokenCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        this.setTokenCookies(response, accessToken, this.accessTokenLifespan, refreshToken, this.refreshTokenLifespan);
    }

    private void expireTokenCookies(HttpServletResponse response) {
        this.setTokenCookies(response, "", 0L, "", 0L);
    }

    private void setTokenCookies(HttpServletResponse response, String accessToken, long accessTime,
                                 String refreshToken, long refreshTime) {

        ResponseCookie accessCookie = this.createResponseCookie("access_token", accessToken,
                Duration.ofSeconds(accessTime));
        ResponseCookie refreshCookie = this.createResponseCookie("refresh_token", refreshToken,
                Duration.ofSeconds(refreshTime));


        this.setCookies(response, accessCookie, refreshCookie);

    }

    private ResponseCookie createResponseCookie(String name, String value, Duration duration) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(this.secureHttpCookies)
                .sameSite(this.SAME_SITE)
                .domain(this.cookieDomain)
                .path("/")
                .maxAge(duration)
                .build();
    }

    private void setCookies(HttpServletResponse response, ResponseCookie accessCookie, ResponseCookie refreshCookie) {
        response.addHeader("Set-Cookie", accessCookie.toString());
        response.addHeader("Set-Cookie", refreshCookie.toString());
    }

}
