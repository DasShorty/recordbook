package de.dasshorty.recordbook.book.week;

import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookWeekRepository extends JpaRepository<@NonNull BookWeek, @NonNull UUID> {

    @Query("SELECT DISTINCT weeks FROM Book book JOIN book.weeks weeks WHERE book.id = :bookId AND weeks.calendarWeek = :calendarWeek AND weeks.year = :year")
    Optional<BookWeek> findByCalendarWeekAndBookId(int calendarWeek, int year, UUID bookId);

    boolean existsByCalendarWeekAndYear(int calendarWeek, int year);

    long countByLocked(boolean locked);

    long countBySignedFromTrainerIsNotNull();

    @Query("SELECT weeks FROM Book book JOIN book.weeks weeks WHERE book.trainee.id = :traineeId")
    List<BookWeek> findAllByTraineeId(UUID traineeId);

    @Query("SELECT weeks FROM Book book JOIN book.weeks weeks WHERE book.trainer.id = :trainerId AND weeks.locked = true AND weeks.signedFromTrainer IS NULL")
    List<BookWeek> findPendingSignatureWeeksByTrainerId(UUID trainerId);

    @Query("SELECT COUNT(weeks) FROM Book book JOIN book.weeks weeks WHERE book.trainer.id = :trainerId AND weeks.signedFromTrainer IS NOT NULL")
    long countSignedWeeksByTrainerId(UUID trainerId);

}
