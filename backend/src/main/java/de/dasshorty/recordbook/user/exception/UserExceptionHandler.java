package de.dasshorty.recordbook.user.exception;

import de.dasshorty.recordbook.http.result.ErrorResult;
import de.dasshorty.recordbook.user.UserController;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(assignableTypes = { UserController.class })
public class UserExceptionHandler {

    @Deprecated
    @ExceptionHandler(UserAlreadyExistingException.class)
    public ResponseEntity<ErrorResult> handleUserAlreadyExistingException(
        UserAlreadyExistingException ex
    ) {
        return ResponseEntity.badRequest().body(
            new ErrorResult(ex.getMessage(), "email")
        );
    }

    @ExceptionHandler(TrainerNotFoundException.class)
    public ProblemDetail  handleTrainerNotFoundException(TrainerNotFoundException exception, HttpServletRequest request) {
        var problem = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problem.setTitle("Trainer not found");
        problem.setDetail(exception.getMessage() + " not found");
        return problem;
    }
}
