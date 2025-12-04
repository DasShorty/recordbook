package de.dasshorty.recordbook.book.week.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record CreateWeekDto(
        @Min(value = 1, message = "calendarWeek must be between 1 and 53")
        @Max(value = 53, message = "calendarWeek must be between 1 and 53")
        int calendarWeek,
        @Min(value = 1900, message = "year must be at least 1900")
        @Max(value = 2100, message = "year must not exceed 2100")
        int year
) {
}
