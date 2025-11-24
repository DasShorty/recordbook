package de.dasshorty.recordbook.job.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record CreateJobDto(
    @NotBlank(message = "Name is required") String name,
    @NotBlank(message = "Description is required") String description,
    @Size(
        min = 1,
        message = "A minimum of one qualification is required for a qualified job"
    )
    List<UUID> qualifications
) {}
