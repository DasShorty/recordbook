package de.dasshorty.recordbook.book.httpbodies;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.util.List;
import java.util.UUID;

public record CreateBookDto(@NotBlank(message = "trainee is required") UUID trainee,
                            @Min(value = 1, message = "one trainer is required") List<UUID> trainers,
                            @NotBlank(message = "job is required") UUID job) {
}
