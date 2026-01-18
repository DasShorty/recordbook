package de.dasshorty.recordbook.statistics.dto;

import java.io.Serializable;

public record LocationStatisticsDto(
        long workDays,
        long schoolDays,
        long guidanceDays
) implements Serializable {
}
