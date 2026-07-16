package de.dasshorty.recordbook.book.week.day.exceptions;

public class BookDayNotFoundException extends RuntimeException {
    public BookDayNotFoundException(String message) {
        super(message);
    }
}
