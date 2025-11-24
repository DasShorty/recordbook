package de.dasshorty.recordbook.job.qualifications.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import java.util.UUID;

public record QualificationDto(
    UUID id,
    @NotBlank(message = "Name is required") String name,
    String description,

    @Min(value = 1, message = "minimum one hour required")
    @Max(value = 24, message = "maximum of 24 hours reached")
    @Positive(message = "Only positive numbers allowed")
    double minimumDuration
) {}
