package de.dasshorty.recordbook.book.week.exceptions;

public class BookWeekNotFoundException extends RuntimeException {
    public BookWeekNotFoundException(String message) {
        super(message);
    }
}
