package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.book.week.BookWeek;
import de.dasshorty.recordbook.user.User;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookRepository extends JpaRepository<Book, UUID> {
    String TABLE_NAME = "books";

    // PostgreSQL-specific command - must use native query
    @Modifying
    @Transactional
    @Query(nativeQuery = true, value = "ANALYZE " + TABLE_NAME)
    void analyze();

    @Query("SELECT w FROM Book b JOIN b.weeks w WHERE b.id = :bookId")
    Page<BookWeek> getWeeks(UUID bookId, Pageable pageable);

    Optional<Book> getBookByTrainee(User trainee);

    @Query("SELECT COUNT(b) FROM Book b WHERE b.trainer.id = :trainerId")
    long countByTrainerId(UUID trainerId);
}
