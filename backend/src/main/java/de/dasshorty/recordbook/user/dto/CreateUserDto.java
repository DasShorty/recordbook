package de.dasshorty.recordbook.user.dto;

import de.dasshorty.recordbook.user.PasswordGenerator;
import de.dasshorty.recordbook.user.User;
import de.dasshorty.recordbook.user.UserType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record CreateUserDto(
        @NotBlank(message = "Forename is required")
        String forename,
        @NotBlank(message = "Surname is required")
        String surname,
        @NotBlank(message = "EMail is required")
        @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Invalid email address")
        String email,
        @NotNull(message = "user has to have a type")
        UserType userType) {

    public User toNewUserWithRandomPassword() {
        return new User(forename(), surname(), email(), this.generateRandomPassword(), List.of(userType().getAuthority()), userType());
    }

    private String generateRandomPassword() {
        return PasswordGenerator.generateRandomPassword(8);
    }

}
