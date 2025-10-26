package de.dasshorty.recordbook.user.httpbodies;

import de.dasshorty.recordbook.user.UserType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record CreateUserBody(
        @NotBlank(message = "Forename is required")
        String forename,
        @NotBlank(message = "Surname is required")
        String surname,
        @NotBlank(message = "EMail is required")
        @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Invalid email address")
        String email,
        @NotNull(message = "user has to have a type")
        UserType userType) {
}
