package de.dasshorty.recordbook.book.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.net.URI;

@ControllerAdvice
@Component
public class BookExceptionHandler {

    @ExceptionHandler(BookNotFoundException.class)
    public ProblemDetail handleBookNotFoundException(@NonNull BookNotFoundException exception, @NonNull HttpServletRequest request) {

        var problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);

        problemDetail.setInstance(URI.create(request.getRequestURI()));
        problemDetail.setTitle("Book not found");
        problemDetail.setDetail(exception.getMessage() + " not found");

        return problemDetail;
    }

}
