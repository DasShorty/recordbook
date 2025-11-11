package de.dasshorty.recordbook.user.exception;

public class UserAlreadyExistingException extends RuntimeException {
    public UserAlreadyExistingException(String message) {
        super(message);
    }
}
