package de.dasshorty.recordbook.exception;

public class MissingTokenException extends RuntimeException {
    public MissingTokenException(String tokenName) {
        super(tokenName);
    }

    public MissingTokenException(String tokenName, Throwable cause) {
        super(tokenName, cause);
    }
}

