package de.dasshorty.recordbook.exception;

public class AlreadyExistingException extends RuntimeException {

    private final Object value;

    public AlreadyExistingException(String parameter, Object value) {
        super(parameter);
        this.value = value;
    }

    public Object getValue() {
        return value;
    }
}
