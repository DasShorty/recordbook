package de.dasshorty.recordbook.user.exceptions;

public class UserAlreadyExistingException extends RuntimeException {

    public UserAlreadyExistingException(String message) {
        super(message);
    }
}
