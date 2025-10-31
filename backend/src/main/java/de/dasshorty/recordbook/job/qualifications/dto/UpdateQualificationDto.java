package de.dasshorty.recordbook.job.qualifications.dto;

import de.dasshorty.recordbook.job.qualifications.Qualification;
import jakarta.validation.constraints.*;

import java.util.UUID;

public record UpdateQualificationDto(
        @NotNull(message = "Id is required")
        UUID id,
        @NotBlank(message = "Name is required")
        String name,
        @NotBlank(message = "Description is required")
        String description,
        @Min(value = 1, message = "minimum one hour required")
        @Max(value = 24, message = "maximum of 24 hours reached")
        @Positive(message = "Only positive numbers allowed")
        double minimumDuration
) {

    public Qualification toQualification() {
        return new Qualification(id(), name(), description(), minimumDuration());
    }

}
