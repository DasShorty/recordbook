package de.dasshorty.recordbook.user.httpbodies;

import de.dasshorty.recordbook.user.Authority;
import de.dasshorty.recordbook.user.UserType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public record PasswordUserBody(
        @NotBlank(message = "Forename is required")
        String forename,
        @NotBlank(message = "Surname is required")
        String surname,
        @NotBlank(message = "EMail is required")
        @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Invalid email address")
        String email,
        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password has to be at least 6 characters long")
        String password,
        @NotNull(message = "user has to have a type")
        UserType userType,
        @NotNull(message = "user has to have at least one authority")
        @Size(min = 1, message = "user has to have at least one authority")
        List<Authority> authorities) {
}
