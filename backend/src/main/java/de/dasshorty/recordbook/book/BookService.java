package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.book.week.BookWeekDto;
import de.dasshorty.recordbook.book.week.BookWeekService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final BookWeekService bookWeekService;

    @Autowired
    public BookService(BookRepository bookRepository, BookWeekService bookWeekService) {
        this.bookRepository = bookRepository;
        this.bookWeekService = bookWeekService;
    }

    public Optional<BookDto> getBookById(UUID bookId) {
        return bookRepository.findById(bookId);
    }

    public List<BookWeekDto> getBookWeeks(UUID bookId) {
        return this.bookRepository.getWeeks(bookId)
                .stream()
                .map(UUID::fromString)
                .map(this.bookWeekService::getWeekById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();
    }

    public BookDto createBook(BookDto bookDto) {
        BookDto save = bookRepository.save(bookDto);
        this.bookRepository.analyze();
        return save;
    }

}
