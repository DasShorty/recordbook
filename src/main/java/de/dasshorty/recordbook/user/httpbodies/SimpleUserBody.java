package de.dasshorty.recordbook.user.httpbodies;

import de.dasshorty.recordbook.user.UserType;

public record SimpleUserBody(String forename, String surname, String email, String password, UserType userType) {
}
