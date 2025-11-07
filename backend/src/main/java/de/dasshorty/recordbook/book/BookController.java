package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.authentication.jwt.JwtHandler;
import de.dasshorty.recordbook.book.dto.CreateBookDto;
import de.dasshorty.recordbook.http.handler.UserInputHandler;
import de.dasshorty.recordbook.http.result.ErrorResult;
import de.dasshorty.recordbook.http.result.QueryResult;
import de.dasshorty.recordbook.job.Job;
import de.dasshorty.recordbook.job.JobService;
import de.dasshorty.recordbook.user.User;
import de.dasshorty.recordbook.user.UserService;
import de.dasshorty.recordbook.user.UserType;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;
    private final UserService userService;
    private final JobService jobService;
    private final JwtHandler jwtHandler;

    @Value("${query.limit}")
    private int defaultLimit;

    @Value("${query.offset}")
    private int defaultOffset;

    @Autowired
    public BookController(BookService bookService, UserService userService, JobService jobService, JwtHandler jwtHandler) {
        this.bookService = bookService;
        this.userService = userService;
        this.jobService = jobService;
        this.jwtHandler = jwtHandler;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'TRAINER')")
    public ResponseEntity<?> getAssignedTraineeBooks(@CookieValue("access_token") String accessToken,
                                                     @RequestParam(value = "offset") Integer offset,
                                                     @RequestParam(value = "limit") Integer limit) {

        int convertedOffset = UserInputHandler.validInteger(offset) ? offset : this.defaultOffset;
        int convertedLimit = UserInputHandler.validInteger(limit) ? limit : this.defaultLimit;

        Optional<UUID> optional = this.jwtHandler.extractUserId(accessToken);

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("not found", "access_token"));
        }

        UUID uuid = optional.get();

        Optional<User> optionalUser = this.userService.retrieveUserById(uuid);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("not found", "user"));
        }

        User user = optionalUser.get();

        if (user.getUserType() != UserType.TRAINER && !user.isAdministrator()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResult("forbidden", "user"));
        }

        List<Book> booksByTrainer = this.bookService.getBooksByTrainer(user.getId(), convertedOffset, convertedLimit);
        long booksByTrainersCount = this.bookService.getBooksByTrainersCount(user.getId());

        return ResponseEntity.ok(new QueryResult<>(
                booksByTrainersCount, convertedLimit, convertedOffset,
                booksByTrainer.stream().map(Book::toDto).toList()
        ));
    }

    @SuppressWarnings("DuplicatedCode")
    @GetMapping("/me")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'TRAINEE')")
    public ResponseEntity<?> getOwnBook(@CookieValue("access_token") String accessToken) {

        Optional<UUID> optional = this.jwtHandler.extractUserId(accessToken);

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("not found", "access_token"));
        }

        UUID uuid = optional.get();

        Optional<User> optionalUser = this.userService.retrieveUserById(uuid);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("not found", "user"));
        }

        User user = optionalUser.get();
        Optional<Book> book = this.bookService.getBookByTrainee(user);

        return ResponseEntity.of(book);
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<?> getBookById(@PathVariable("bookId") String bookId) {

        Optional<Book> optional = this.bookService.getBookById(UUID.fromString(bookId));

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("data not found", "bookId"));
        }

        return ResponseEntity.ok(optional.get().toDto());
    }

    @PostMapping
    public ResponseEntity<?> createBook(@RequestBody @Valid CreateBookDto bookBody) {

        Optional<User> traineeOptional = this.userService.retrieveUserById(bookBody.trainee());

        if (traineeOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("data not found", "trainee"));
        }

        List<Optional<User>> optionalTrainers = bookBody.trainers().stream().map(this.userService::retrieveUserById).toList();

        if (optionalTrainers.stream().anyMatch(Optional::isEmpty)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("one data not found", "trainers"));
        }

        List<User> list = optionalTrainers.stream().filter(Optional::isPresent).map(Optional::get).toList();

        Optional<Job> optionalJob = this.jobService.getJobById(bookBody.job());

        if (optionalJob.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("data not found", "job"));
        }

        return ResponseEntity.ok(this.bookService.createBook(new Book(traineeOptional.get(), list, optionalJob.get())));
    }

}
