package de.dasshorty.recordbook.book.week;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookWeekRepository extends JpaRepository<BookWeek, UUID> {

    String TABLE_NAME = "weeks";

    @Modifying
    @Transactional
    @Query(nativeQuery = true, value = "ANALYZE " + TABLE_NAME)
    void analyze();

    @Transactional
    @Query(nativeQuery = true, value = "SELECT reltuples::bigint FROM pg_class WHERE relname = '" + TABLE_NAME + "'")
    long getAnalyzedCount();

    @Query(nativeQuery = true, value = "SELECT * FROM " + TABLE_NAME + " LIMIT ?1 OFFSET ?2")
    List<BookWeek> getWeeks(int limit, int offset);

    @Query("SELECT weeks FROM Book book JOIN book.weeks weeks WHERE book.id = :bookId")
    List<BookWeek> findWeeksByBookId(UUID bookId);

    @Query("SELECT weeks FROM Book book JOIN book.weeks weeks WHERE book.id = :bookId AND weeks.calendarWeek = :calendarWeek AND weeks.year = :year")
    Optional<BookWeek> findByCalendarWeekAndBookId(int calendarWeek, int year, UUID bookId);

    boolean existsByCalendarWeekAndYear(int calendarWeek, int year);

}
