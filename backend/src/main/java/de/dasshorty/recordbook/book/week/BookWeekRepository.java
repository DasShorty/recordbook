package de.dasshorty.recordbook.book.week;

import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface BookWeekRepository extends JpaRepository<@NonNull BookWeek, @NonNull UUID> {

    @Query("SELECT DISTINCT weeks FROM Book book JOIN book.weeks weeks WHERE book.id = :bookId AND weeks.calendarWeek = :calendarWeek AND weeks.year = :year")
    Optional<BookWeek> findByCalendarWeekAndBookId(int calendarWeek, int year, UUID bookId);

    boolean existsByCalendarWeekAndYear(int calendarWeek, int year);

}
