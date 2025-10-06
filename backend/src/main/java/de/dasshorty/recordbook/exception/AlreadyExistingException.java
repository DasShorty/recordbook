package de.dasshorty.recordbook.exception;

public class AlreadyExistingException extends RuntimeException {

    private final Object value;

    public AlreadyExistingException(String paremeter, Object value) {
        super(paremeter);
        this.value = value;
    }

    public Object getValue() {
        return value;
    }
}
