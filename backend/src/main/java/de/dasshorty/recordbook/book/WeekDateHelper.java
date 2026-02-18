package de.dasshorty.recordbook.book;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.IsoFields;
import java.time.temporal.TemporalAdjusters;

public class WeekDateHelper {

    public static LocalDate getFirstDayOfWeek(int year, int weekNumber) {
        return LocalDate.of(year, 1, 4)
                .with(IsoFields.WEEK_OF_WEEK_BASED_YEAR, weekNumber)
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    }

    public static LocalDate getLastDayOfWeek(int year, int weekNumber) {
        return getFirstDayOfWeek(year, weekNumber)
                .with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
    }

}
