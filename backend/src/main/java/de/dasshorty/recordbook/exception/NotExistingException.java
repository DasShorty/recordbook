package de.dasshorty.recordbook.exception;

public class NotExistingException extends RuntimeException {
    public NotExistingException(String message) {
        super(message);
    }
}
