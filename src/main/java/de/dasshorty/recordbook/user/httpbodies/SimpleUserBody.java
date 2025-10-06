package de.dasshorty.recordbook.user.httpbodies;

import de.dasshorty.recordbook.user.Authority;
import de.dasshorty.recordbook.user.UserType;

import java.util.List;

public record SimpleUserBody(String forename, String surname, String email, String password, UserType userType, List<Authority> authorities) {
}
