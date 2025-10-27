package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.authentication.jwt.JwtHandler;
import de.dasshorty.recordbook.book.httpbodies.BookDto;
import de.dasshorty.recordbook.book.httpbodies.CreateBookDto;
import de.dasshorty.recordbook.book.week.httpbodies.BookWeekDto;
import de.dasshorty.recordbook.http.result.ErrorResult;
import de.dasshorty.recordbook.job.Job;
import de.dasshorty.recordbook.job.JobService;
import de.dasshorty.recordbook.user.User;
import de.dasshorty.recordbook.user.UserService;
import de.dasshorty.recordbook.user.httpbodies.UserDto;
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

        return ResponseEntity.ok(BookDto.fromBook(optional.get()));
    }

    @GetMapping("/{bookId}/weeks")
    public ResponseEntity<?> getWeeks(@PathVariable("bookId") String bookId) {
        return ResponseEntity.ok(bookService.getBookWeeks(UUID.fromString(bookId)).stream()
                .map(week -> new BookWeekDto(week.getId(), UserDto.fromUser(week.getSignedFromTrainer()), week.getDays())).toList());
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
