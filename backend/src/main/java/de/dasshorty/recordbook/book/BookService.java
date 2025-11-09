package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.book.week.BookWeek;
import de.dasshorty.recordbook.book.week.BookWeekService;
import de.dasshorty.recordbook.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
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

    public Optional<Book> getBookById(UUID bookId) {
        return bookRepository.findById(bookId);
    }

    public List<BookWeek> getBookWeeks(UUID bookId) {
        return this.bookRepository.getWeeks(bookId).stream().map(UUID::fromString).map(this.bookWeekService::getWeekById).filter(
                Optional::isPresent).map(Optional::get).toList();
    }

    public Book createBook(Book book) {
        Book save = bookRepository.save(book);
        this.bookRepository.analyze();
        return save;
    }

    public Optional<Book> getBookByTrainee(User trainee) {
        return this.bookRepository.getBookByTrainee(trainee);
    }

    public List<Book> getBooksByTrainer(UUID trainer, int offset, int limit) {
        return this.bookRepository.getBooksByTrainersContaining(trainer, limit, offset);
    }

    public long getBooksByTrainersCount(UUID trainerId) {
        return this.bookRepository.getBooksByTrainersCount(trainerId);
    }

}
