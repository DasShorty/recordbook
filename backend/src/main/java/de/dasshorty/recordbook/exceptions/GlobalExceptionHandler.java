package de.dasshorty.recordbook.exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        var field = ex.getFieldError() != null ? ex.getFieldError().getField() : "unknown";
        var message = ex.getFieldError() != null ? ex.getFieldError().getDefaultMessage() : "Validation error";
        return ApiProblemDetails.fromException(HttpStatus.BAD_REQUEST, message, field, ex);
    }

//    @ExceptionHandler(IllegalArgumentException.class)
//    public ProblemDetail handleIllegalArgumentException(IllegalArgumentException ex) {
//        return ResponseEntity.badRequest().body(new ErrorResult(ex.getMessage(), null));
//    }
//
//    @ExceptionHandler(IllegalStateException.class)
//    public ProblemDetail handleIllegalStateException(IllegalStateException ex) {
//        return ResponseEntity.badRequest().body(new ErrorResult(ex.getMessage(), null));
//    }
//
//    @ExceptionHandler(JwtException.class)
//    public ProblemDetail handleJwtException(JwtException ex) {
//        return ResponseEntity.badRequest().body(new ErrorResult(ex.getMessage(), "access_token"));
//    }
//
//    @ExceptionHandler(NoSuchElementException.class)
//    public ProblemDetail handleNoSuchElementException(NoSuchElementException ex) {
//        return ResponseEntity.badRequest().body(new ErrorResult(ex.getMessage(), null));
//    }
//
//    @ExceptionHandler(ForbiddenException.class)
//    public ProblemDetail handleForbiddenException(ForbiddenException ex) {
//        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResult(ex.getMessage(), "Authorization"));
//    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        var message = ex.getMessage();
        if (message != null && message.toLowerCase().contains("email")) {
            return ApiProblemDetails.fromException(HttpStatus.CONFLICT, "User with this email already exists", ex);
        }
        return ApiProblemDetails.fromException(HttpStatus.BAD_REQUEST, "Constraint violation", ex);
    }

    @ExceptionHandler(MissingTokenException.class)
    public ProblemDetail handleMissingTokenException(MissingTokenException ex) {
        return ApiProblemDetails.fromException(HttpStatus.UNAUTHORIZED, "Missing Token", ex);
    }

}
