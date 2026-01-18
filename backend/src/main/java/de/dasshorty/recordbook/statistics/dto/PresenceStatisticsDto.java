package de.dasshorty.recordbook.statistics.dto;

import java.io.Serializable;

public record PresenceStatisticsDto(
        long presentDays,
        long vacationDays,
        long absenceDays,
        long compensatoryTimeDays
) implements Serializable {
}
