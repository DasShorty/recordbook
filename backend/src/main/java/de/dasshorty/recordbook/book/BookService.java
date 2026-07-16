package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.authentication.jwt.JwtHandler;
import de.dasshorty.recordbook.book.dto.BookDto;
import de.dasshorty.recordbook.book.dto.CreateBookCommand;
import de.dasshorty.recordbook.book.week.BookWeek;
import de.dasshorty.recordbook.exceptions.MissingTokenException;
import de.dasshorty.recordbook.user.Authority;
import de.dasshorty.recordbook.user.User;
import de.dasshorty.recordbook.user.UserService;
import de.dasshorty.recordbook.user.exceptions.UserNotFoundException;
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
    private final JwtHandler jwtHandler;

    public BookService(BookRepository bookRepository, UserService userService, JwtHandler jwtHandler) {
        this.bookRepository = bookRepository;
        this.userService = userService;
        this.jwtHandler = jwtHandler;
    }

    @Transactional(readOnly = true)
    public Optional<Book> getBookEntityByWeekId(UUID weekId) {
        return this.bookRepository.findBookByWeekId(weekId);
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

    @Transactional
    public Optional<BookDto> getBookByTrainee(User trainee) {
        return this.getBookEntityByTrainee(trainee).map(Book::toDto);
    }

    @Transactional(readOnly = true)
    public Optional<Book> getBookEntityByTrainee(User trainee) {
        return this.bookRepository.getBookByTrainee(trainee);
    }

    public void updateBookEntity(Book book) {
        this.bookRepository.save(book);
    }

    @Transactional
    public BookDto createBookFromDto(CreateBookCommand dto) {
        User trainee = this.userService.retrieveUserEntityById(dto.trainee()).orElseThrow(() -> new UserNotFoundException("Trainee not found"));
        User trainer = this.userService.retrieveUserEntityById(dto.trainer()).orElseThrow(() -> new UserNotFoundException("Trainer not found"));

        Book book = new Book(trainee, trainer);
        return this.createBook(book);
    }

    @Transactional(readOnly = true)
    public Optional<BookDto> getBookByTraineeId(UUID traineeId) {
        User trainee = this.userService.retrieveUserEntityById(traineeId).orElseThrow(() -> new UserNotFoundException("Trainee not found"));
        return this.getBookByTrainee(trainee);
    }

    @Transactional(readOnly = true)
    public Optional<BookDto> getOwnBookByAccessToken(String accessToken) {
        Optional<UUID> optional = this.jwtHandler.extractUserId(accessToken);

        if (optional.isEmpty()) {
            throw new MissingTokenException("access_token");
        }

        UUID userId = optional.get();
        User user = this.userService.retrieveUserEntityById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (user.getAuthority() == Authority.TRAINER) {
            return this.bookRepository.findFirstByTrainer(user).map(Book::toDto);
        }

        return this.getBookByTraineeId(userId);
    }

    public Page<BookDto> getBooks(Pageable pageable) {
        return this.bookRepository.findAll(pageable).map(Book::toDto);
    }

    @Transactional
    public Optional<BookDto> updateBookTrainer(Book book, UUID newTrainerId) {


        var newTrainer = this.userService.retrieveUserEntityById(newTrainerId);

        if (newTrainer.isEmpty()) {
            throw new UserNotFoundException("Trainer not found");
        }

        book.setTrainer(newTrainer.get());
        return Optional.of(this.createBook(book));
    }
}
