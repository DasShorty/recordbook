package de.dasshorty.recordbook.statistics.dto;

import java.io.Serializable;

public record AdminStatisticsDto(
        long totalUsers,
        long totalTrainees,
        long totalTrainers,
        long totalBooks,
        long totalWeeks,
        long completedWeeks
) implements Serializable {
}
