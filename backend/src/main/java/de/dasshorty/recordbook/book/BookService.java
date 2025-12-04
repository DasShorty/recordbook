package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.book.dto.BookDto;
import de.dasshorty.recordbook.book.dto.CreateBookDto;
import de.dasshorty.recordbook.book.week.BookWeek;
import de.dasshorty.recordbook.book.week.BookWeekService;
import de.dasshorty.recordbook.exception.ForbiddenException;
import de.dasshorty.recordbook.exception.NotExistingException;
import de.dasshorty.recordbook.user.User;
import de.dasshorty.recordbook.user.UserService;
import de.dasshorty.recordbook.user.UserType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final UserService userService;

    public BookService(
            BookRepository bookRepository,
            BookWeekService bookWeekService,
            UserService userService
    ) {
        this.bookRepository = bookRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public Optional<BookDto> getBookById(UUID bookId) {
        return bookRepository.findById(bookId).map(Book::toDto);
    }

    @Transactional(readOnly = true)
    public Page<BookWeek> getBookWeeks(UUID bookId, Pageable pageable) {
        return this.bookRepository.getWeeks(bookId, pageable);
    }

    @Transactional
    public BookDto createBook(Book book) {
        Book save = bookRepository.save(book);
        this.bookRepository.analyze();
        return save.toDto();
    }

    @Transactional(readOnly = true)
    public Optional<BookDto> getBookByTrainee(User trainee) {
        return this.bookRepository.getBookByTrainee(trainee).map(Book::toDto);
    }

    @Transactional(readOnly = true)
    public Page<BookDto> getBooksByTrainer(UUID trainer, Pageable pageable) {
        return this.bookRepository.getBooksByTrainersContaining(
                trainer,
                pageable
        ).map(Book::toDto);
    }

    @Transactional
    public BookDto createBookFromDto(CreateBookDto dto) {
        User trainee = this.userService.retrieveUserEntityById(
                dto.trainee()
        ).orElseThrow(() -> new NotExistingException("Trainee not found"));

        User trainer = this.userService.retrieveUserEntityById(dto.trainee())
                .orElseThrow(() -> new NotExistingException("Trainer not found"));

        Book book = new Book(trainee, trainer);
        return this.createBook(book);
    }

    @Transactional(readOnly = true)
    public Optional<BookDto> getBookByTraineeId(UUID traineeId) {
        User trainee = this.userService.retrieveUserEntityById(
                traineeId
        ).orElseThrow(() -> new NotExistingException("Trainee not found"));
        return this.getBookByTrainee(trainee);
    }

    @Transactional(readOnly = true)
    public Page<BookDto> getBooksByTrainerForAuthorizedUser(
            UUID userId,
            Pageable pageable
    ) {
        User user = this.userService.retrieveUserEntityById(userId).orElseThrow(
                () -> new NotExistingException("User not found")
        );

        if (user.getUserType() != UserType.TRAINER && !user.isAdministrator()) {
            throw new ForbiddenException(
                    "Only trainers or administrators can access trainer books"
            );
        }

        return this.getBooksByTrainer(userId, pageable);
    }
}
