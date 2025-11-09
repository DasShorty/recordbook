package de.dasshorty.recordbook.book.dto;

import de.dasshorty.recordbook.job.Job;
import de.dasshorty.recordbook.user.dto.UserDto;

import java.util.List;
import java.util.UUID;

public record BookDto(UUID id, UserDto trainee, List<UserDto> trainers, Job qualifiedJob) {

}
