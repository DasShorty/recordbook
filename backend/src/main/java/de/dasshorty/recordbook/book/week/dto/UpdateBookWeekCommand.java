package de.dasshorty.recordbook.book.week.dto;

import de.dasshorty.recordbook.book.week.day.dto.UpdateBookDayCommand;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record UpdateBookWeekCommand(
        @NotNull UUID id,
        String text,
        @Valid List<UpdateBookDayCommand> days
) {
}
