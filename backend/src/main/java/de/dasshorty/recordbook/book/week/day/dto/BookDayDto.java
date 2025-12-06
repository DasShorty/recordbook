package de.dasshorty.recordbook.book.week.day.dto;

import de.dasshorty.recordbook.book.week.day.Presence;
import de.dasshorty.recordbook.book.week.day.PresenceLocation;

import java.time.LocalDate;
import java.util.UUID;

public record BookDayDto(
        UUID id,
        LocalDate date,
        double duration,
        Presence presence,
        PresenceLocation presenceLocation
) {
}
