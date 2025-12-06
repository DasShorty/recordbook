package de.dasshorty.recordbook.book.dto;

import de.dasshorty.recordbook.user.dto.UserDto;

import java.util.UUID;

public record BookDto(UUID id, UserDto trainee, UserDto trainer) {
}
