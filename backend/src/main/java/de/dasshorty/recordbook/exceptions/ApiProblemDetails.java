package de.dasshorty.recordbook.exceptions;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;

import java.time.Instant;

public final class ApiProblemDetails {

    private ApiProblemDetails() {
    }

    public static ProblemDetail fromException(HttpStatusCode status, String title, Throwable exception) {
        return fromException(status, title, exception.getMessage(), exception);
    }

    public static ProblemDetail fromException(HttpStatusCode status, String title, String detail, Throwable exception) {
        Instant now = Instant.now();

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(status, detail);
        problemDetail.setTitle(title);
        problemDetail.setProperty("errorCode", exception.getClass().getSimpleName());
        problemDetail.setProperty("timestampIso", now.toString());
        problemDetail.setProperty("timestampEpochMillis", now.toEpochMilli());
        return problemDetail;
    }

    public static ProblemDetail fromCode(HttpStatusCode status, String title, String detail, String errorCode) {
        Instant now = Instant.now();

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(status, detail);
        problemDetail.setTitle(title);
        problemDetail.setProperty("errorCode", errorCode);
        problemDetail.setProperty("timestampIso", now.toString());
        problemDetail.setProperty("timestampEpochMillis", now.toEpochMilli());
        return problemDetail;
    }
}

