package de.dasshorty.recordbook.exception;

import de.dasshorty.recordbook.http.result.ErrorResult;
import io.jsonwebtoken.JwtException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResult> handleValidation(MethodArgumentNotValidException ex) {
        var field = ex.getFieldError() != null ? ex.getFieldError().getField() : "unknown";
        var message = ex.getFieldError() != null ? ex.getFieldError().getDefaultMessage() : "Validation error";
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

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResult> handleIllegalStateException(IllegalStateException ex) {
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

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ErrorResult> handleNoSuchElementException(NoSuchElementException ex) {
        return ResponseEntity.badRequest().body(new ErrorResult(ex.getMessage(), null));
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorResult> handleForbiddenException(ForbiddenException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResult(ex.getMessage(), "Authorization"));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResult> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        var message = ex.getMessage();
        if (message != null && message.toLowerCase().contains("email")) {
            return ResponseEntity.badRequest().body(new ErrorResult("User with this email already exists", "email"));
        }
        return ResponseEntity.badRequest().body(new ErrorResult("Database constraint violation", null));
    }

}
