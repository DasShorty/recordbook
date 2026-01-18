package de.dasshorty.recordbook.statistics.dto;

import java.io.Serializable;

public record TrainerStatisticsDto(
        long assignedTrainees,
        long pendingSignatureWeeks,
        long signedWeeks
) implements Serializable {
}
