package de.dasshorty.recordbook.job.dto;

import de.dasshorty.recordbook.job.qualifications.dto.QualificationDto;

import java.util.List;
import java.util.UUID;

public record JobDto(
        UUID id,
        String name,
        String description,
        List<QualificationDto> qualifications
) {
}

