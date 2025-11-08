package de.dasshorty.recordbook.book.dto;

import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public record CreateBookDto(UUID trainee,
                            @Size(min = 1, message = "one trainer is required") List<UUID> trainers,
                            UUID job) {
}
