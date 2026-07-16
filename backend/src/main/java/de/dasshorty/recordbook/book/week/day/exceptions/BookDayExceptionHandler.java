package de.dasshorty.recordbook.book.week.day.exceptions;

import de.dasshorty.recordbook.exceptions.ApiProblemDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class BookDayExceptionHandler {

    @ExceptionHandler(BookDayNotFoundException.class)
    public ProblemDetail handleBookDayNotFoundException(BookDayNotFoundException ex) {
        return ApiProblemDetails.fromException(HttpStatus.NOT_FOUND, "Book Day Not Found", ex);
    }

}
