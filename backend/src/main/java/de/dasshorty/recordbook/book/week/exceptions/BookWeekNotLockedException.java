package de.dasshorty.recordbook.book.week.exceptions;

public class BookWeekNotLockedException extends RuntimeException {
    public BookWeekNotLockedException(String message) {
        super(message);
    }
}
