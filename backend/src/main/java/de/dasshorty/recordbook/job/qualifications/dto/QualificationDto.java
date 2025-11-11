package de.dasshorty.recordbook.job.qualifications.dto;

import java.util.UUID;

public record QualificationDto(
        UUID id,
        String name,
        String description,
        double minimumDuration
) {
}

