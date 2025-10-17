package de.dasshorty.recordbook.exception;

import de.dasshorty.recordbook.http.result.ErrorResult;
import io.jsonwebtoken.JwtException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResult> handleValidation(MethodArgumentNotValidException ex) {
        String field = ex.getFieldError() != null ? ex.getFieldError().getField() : "unknown";
        String message = ex.getFieldError() != null ? ex.getFieldError().getDefaultMessage() : "Validation error";
        return ResponseEntity.badRequest().body(new ErrorResult(message, field));
    }

    @ExceptionHandler(AlreadyExistingException.class)
    public ResponseEntity<ErrorResult> handleAlreadyExists(AlreadyExistingException ex) {
        return ResponseEntity.badRequest().body(new ErrorResult(String.valueOf(ex.getValue()), ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResult> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(new ErrorResult(ex.getMessage(), null));
    }

    @ExceptionHandler(NotExistingException.class)
    public ResponseEntity<ErrorResult> handleNotExistingException(NotExistingException ex) {
        return ResponseEntity.badRequest().body(new ErrorResult(ex.getMessage(), null));
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ErrorResult> handleJwtException(JwtException ex) {
        return ResponseEntity.badRequest().body(new ErrorResult(ex.getMessage(), "access_token"));
    }

}
