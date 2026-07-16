package de.dasshorty.recordbook.book.week.exceptions;

import de.dasshorty.recordbook.exceptions.ApiProblemDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class BookWeekExceptionHandler {

    @ExceptionHandler(BookWeekIdConversionFailedException.class)
    public ProblemDetail handleBookWeekIdConversionFailedException(BookWeekIdConversionFailedException ex) {
        return ApiProblemDetails.fromException(HttpStatus.BAD_REQUEST, "Book week id conversion failed", ex);
    }

    @ExceptionHandler(BookWeekNotFoundException.class)
    public ProblemDetail handleBookWeekNotFoundException(BookWeekNotFoundException ex) {
        return ApiProblemDetails.fromException(HttpStatus.NOT_FOUND, "Book week not found", ex);
    }

    @ExceptionHandler(BookWeekNotLockedException.class)
    public ProblemDetail handleBookWeekNotLockedException(BookWeekNotLockedException ex) {
        return ApiProblemDetails.fromException(HttpStatus.BAD_REQUEST, "Book week is not locked", ex);
    }

}
