package de.dasshorty.recordbook.book.week.httpbodies;

import de.dasshorty.recordbook.book.week.day.BookDay;
import de.dasshorty.recordbook.user.httpbodies.UserDto;

import java.util.List;
import java.util.UUID;

public record BookWeekDto(UUID id, UserDto signedFromTrainer, List<BookDay> days) {
}
