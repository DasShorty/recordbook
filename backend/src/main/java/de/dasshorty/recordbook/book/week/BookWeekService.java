package de.dasshorty.recordbook.book.week;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookWeekService {

    private final BookWeekRepository bookWeekRepository;

    public BookWeekService(BookWeekRepository bookWeekRepository) {
        this.bookWeekRepository = bookWeekRepository;
    }

    public List<BookWeek> getBookWeeks(int limit, int offset) {
        return this.bookWeekRepository.getWeeks(limit, offset);
    }

    public Optional<BookWeek> getWeekById(UUID id) {
        return this.bookWeekRepository.findById(id);
    }

    public List<BookWeek> getWeeksByBookId(UUID bookId) {
        return bookWeekRepository.findWeeksByBookId(bookId);
    }
}
