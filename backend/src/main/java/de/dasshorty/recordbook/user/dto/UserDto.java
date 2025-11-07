package de.dasshorty.recordbook.user.dto;

import de.dasshorty.recordbook.user.User;
import de.dasshorty.recordbook.user.UserType;

import java.util.UUID;

public record UserDto(UUID id, String forename, String surname, UserType userType) {

    public static UserDto fromUser(User user) {
        return new UserDto(user.getId(), user.getForename(), user.getSurname(), user.getUserType());
    }

}
