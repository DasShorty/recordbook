package de.dasshorty.recordbook.book.exceptions;

import de.dasshorty.recordbook.exceptions.ApiProblemDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class BookExceptionHandler {

    @ExceptionHandler(BookNotFoundException.class)
    public ProblemDetail handleBookNotFoundException(BookNotFoundException ex) {
        return ApiProblemDetails.fromException(HttpStatus.NOT_FOUND, "Book not found", ex);
    }

    @ExceptionHandler(BookIdConversionFailedException.class)
    public ProblemDetail handleBookIdConversionFailedException(BookIdConversionFailedException ex) {
        return ApiProblemDetails.fromException(HttpStatus.BAD_REQUEST, "Book id conversion failed", ex);
    }

}
