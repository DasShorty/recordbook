package de.dasshorty.recordbook;

import de.dasshorty.recordbook.http.result.ErrorResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Objects;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResult> handleValidation(MethodArgumentNotValidException ex){
                String field = ex.getFieldError() != null ? ex.getFieldError().getField() : "unknown";
        String message = ex.getFieldError() != null ? ex.getFieldError().getDefaultMessage() : "Validation error";
        return ResponseEntity.badRequest().body(new ErrorResult(message, field));
    }

}
