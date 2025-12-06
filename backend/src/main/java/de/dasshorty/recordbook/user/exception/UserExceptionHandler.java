package de.dasshorty.recordbook.user.exception;

import de.dasshorty.recordbook.http.result.ErrorResult;
import de.dasshorty.recordbook.user.UserController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(assignableTypes = { UserController.class })
public class UserExceptionHandler {

    @ExceptionHandler(UserAlreadyExistingException.class)
    public ResponseEntity<ErrorResult> handleUserAlreadyExistingException(
        UserAlreadyExistingException ex
    ) {
        return ResponseEntity.badRequest().body(
            new ErrorResult(ex.getMessage(), "email")
        );
    }
}
