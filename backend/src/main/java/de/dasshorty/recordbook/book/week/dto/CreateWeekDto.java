package de.dasshorty.recordbook.book.week.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateWeekDto(@NotBlank(message = "calendarWeek is not existing") int calendarWeek,
                            @NotBlank(message = "year is not existing") int year) {
}
