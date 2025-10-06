package de.dasshorty.recordbook.book.week.day;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BookDayRepository extends JpaRepository<BookDayDto, UUID> {
}
