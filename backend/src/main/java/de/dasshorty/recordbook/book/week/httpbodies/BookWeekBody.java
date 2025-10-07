package de.dasshorty.recordbook.book.week.httpbodies;

import de.dasshorty.recordbook.book.week.day.BookDayDto;
import de.dasshorty.recordbook.user.httpbodies.SafeUserBody;

import java.util.List;
import java.util.UUID;

public record BookWeekBody(UUID id, SafeUserBody signedFromTrainer, List<BookDayDto> days) {
}
