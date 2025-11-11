package de.dasshorty.recordbook.book.week;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookWeekRepository extends JpaRepository<BookWeek, UUID> {

    @Query("SELECT weeks FROM Book book JOIN book.weeks weeks WHERE book.id = :bookId")
    Page<BookWeek> findWeeksByBookId(UUID bookId, Pageable pageable);

    @Query("SELECT weeks FROM Book book JOIN book.weeks weeks WHERE book.id = :bookId AND weeks.calendarWeek = :calendarWeek AND weeks.year = :year")
    Optional<BookWeek> findByCalendarWeekAndBookId(int calendarWeek, int year, UUID bookId);

    boolean existsByCalendarWeekAndYear(int calendarWeek, int year);

}
