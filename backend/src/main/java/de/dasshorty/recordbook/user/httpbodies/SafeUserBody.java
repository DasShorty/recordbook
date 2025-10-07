package de.dasshorty.recordbook.user.httpbodies;

import de.dasshorty.recordbook.user.UserDto;
import de.dasshorty.recordbook.user.UserType;

import java.util.UUID;

public record SafeUserBody(UUID id, String forename, String surname, UserType userType) {

    public static SafeUserBody fromUser(UserDto user) {
        return new SafeUserBody(user.getId(), user.getForename(), user.getSurname(), user.getUserType());
    }

}
