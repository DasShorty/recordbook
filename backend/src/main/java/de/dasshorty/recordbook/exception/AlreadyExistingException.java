package de.dasshorty.recordbook.exception;

import lombok.Getter;

@Getter
public class AlreadyExistingException extends RuntimeException {

    private final Object value;

    public AlreadyExistingException(String parameter, Object value) {
        super(parameter);
        this.value = value;
    }

}
