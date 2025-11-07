package de.dasshorty.recordbook.book.httpbodies;

import de.dasshorty.recordbook.job.Job;

import java.util.List;
import java.util.UUID;

public record BookDto(UUID id, UUID trainee, List<UUID> trainers, Job qualifiedJob) {

}
