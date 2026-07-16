package de.dasshorty.recordbook.user.exceptions;

public class UserIdConversionFailedException extends RuntimeException {
    public UserIdConversionFailedException(String message) {
        super(message);
    }
}
