package de.dasshorty.recordbook.book.week.dto;

import de.dasshorty.recordbook.book.week.day.dto.BookDayDto;
import de.dasshorty.recordbook.user.dto.UserDto;

import java.util.List;
import java.util.UUID;

public record BookWeekDto(UUID id, UserDto signedFromTrainer, int year, int calendarWeek, List<BookDayDto> days) {
}
