package de.dasshorty.recordbook.book.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateBookCommand(@NotNull UUID trainee,
                                @NotNull UUID trainer) {
}
