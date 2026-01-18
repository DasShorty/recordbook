package de.dasshorty.recordbook.statistics.dto;

import java.io.Serializable;
import java.util.List;

public record TraineeStatisticsDto(
        long totalWeeks,
        long completedWeeks,
        long signedWeeks,
        long pendingSignatureWeeks,
        long totalHours,
        long totalMinutes,
        PresenceStatisticsDto presenceStatistics,
        LocationStatisticsDto locationStatistics,
        List<WeeklyHoursDto> weeklyHours
) implements Serializable {
}
