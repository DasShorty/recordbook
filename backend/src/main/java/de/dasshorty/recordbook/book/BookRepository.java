package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.user.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookRepository extends JpaRepository<Book, UUID> {

    String TABLE_NAME = "books";

    @Modifying
    @Transactional
    @Query(nativeQuery = true, value = "ANALYZE " + TABLE_NAME)
    void analyze();

    @Transactional
    @Query(nativeQuery = true, value = "SELECT reltuples::bigint FROM pg_class WHERE relname = '" + TABLE_NAME + "'")
    long getAnalyzedCount();

    @Query(nativeQuery = true, value = "SELECT * FROM " + TABLE_NAME + " LIMIT ?1 OFFSET ?2")
    List<Book> getBooks(int limit, int offset);

    @Query(nativeQuery = true, value = "SELECT weeks_id FROM books_weeks WHERE book_dto_id = ?1")
    List<String> getWeeks(UUID bookId);

    Optional<Book> getBookByTrainee(User trainee);

}
