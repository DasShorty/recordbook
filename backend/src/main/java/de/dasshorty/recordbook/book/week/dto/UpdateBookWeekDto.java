package de.dasshorty.recordbook.book.week.dto;

import de.dasshorty.recordbook.book.week.day.dto.UpdateBookDayDto;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

public record UpdateBookWeekDto(
        UUID id,
        @Valid List<UpdateBookDayDto> days
) {
}
