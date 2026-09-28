package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.book.week.BookWeek;
import de.dasshorty.recordbook.user.User;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    String TABLE_NAME = "books";

    // PostgreSQL-specific command - must use native query
    @Modifying
    @Transactional
    @Query(nativeQuery = true, value = "ANALYZE " + TABLE_NAME)
    void analyze();

    @Query("SELECT w FROM Book b JOIN b.weeks w WHERE b.publicId = :bookId")
    Page<BookWeek> getWeeks(@Param("bookId") UUID bookId, Pageable pageable);

    Optional<Book> getBookByTrainee(User trainee);

    Optional<Book> findFirstByTrainer(User trainer);

    @Query("SELECT COUNT(b) FROM Book b WHERE b.trainer.publicId = :trainerId")
    long countByTrainerId(@Param("trainerId") UUID trainerId);

    @Query("SELECT book FROM Book book JOIN book.weeks week WHERE week.publicId = :weekId")
    Optional<Book> findBookByWeekId(@Param("weekId") UUID weekId);
}
