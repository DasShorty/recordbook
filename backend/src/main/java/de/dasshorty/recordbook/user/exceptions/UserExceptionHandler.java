package de.dasshorty.recordbook.user.exceptions;

import de.dasshorty.recordbook.exceptions.ApiProblemDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class UserExceptionHandler {

    @ExceptionHandler(UserAlreadyExistingException.class)
    public ProblemDetail handleUserAlreadyExistingException(UserAlreadyExistingException ex) {
        return ApiProblemDetails.fromException(HttpStatus.BAD_REQUEST, "User Already Existing", ex);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ProblemDetail handleUserNotFoundException(UserNotFoundException ex) {
        return ApiProblemDetails.fromException(HttpStatus.NOT_FOUND, "Unknown User", ex);
    }

    @ExceptionHandler(UserIdConversionFailedException.class)
    public ProblemDetail handleUserIdConversionFailedException(UserIdConversionFailedException ex) {
        return ApiProblemDetails.fromException(HttpStatus.BAD_REQUEST, "Invalid User ID", ex);
    }
}
