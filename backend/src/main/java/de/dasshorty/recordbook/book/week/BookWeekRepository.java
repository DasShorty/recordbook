package de.dasshorty.recordbook.book.week;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BookWeekRepository extends JpaRepository<BookWeekDto, UUID> {
}
