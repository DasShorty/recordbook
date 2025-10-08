package de.dasshorty.recordbook.user.httpbodies;

import de.dasshorty.recordbook.user.UserDto;
import de.dasshorty.recordbook.user.UserType;

import java.util.UUID;

public record UserBody(UUID id, String forename, String surname, UserType userType) {

    public static UserBody fromUser(UserDto user) {
        return new UserBody(user.getId(), user.getForename(), user.getSurname(), user.getUserType());
    }

}
