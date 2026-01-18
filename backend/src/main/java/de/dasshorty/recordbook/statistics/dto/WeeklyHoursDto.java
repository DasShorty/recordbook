package de.dasshorty.recordbook.statistics.dto;

import java.io.Serializable;

public record WeeklyHoursDto(
        int calendarWeek,
        int year,
        long totalHours,
        long totalMinutes
) implements Serializable {
}
