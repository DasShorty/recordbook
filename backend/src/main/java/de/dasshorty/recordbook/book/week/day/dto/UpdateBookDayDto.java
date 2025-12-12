package de.dasshorty.recordbook.book.week.day.dto;

import de.dasshorty.recordbook.book.week.day.Presence;
import de.dasshorty.recordbook.book.week.day.PresenceLocation;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record UpdateBookDayDto(
        @NotNull UUID id,
        @Min(value = 0)
        @Max(value = 24)
        int hours,
        @Min(value = 0)
        @Max(value = 59)
        int minutes,
        Presence presence,
        PresenceLocation presenceLocation
) {
}
