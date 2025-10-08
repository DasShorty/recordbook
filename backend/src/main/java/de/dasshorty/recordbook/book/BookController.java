package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.book.httpbodies.BookBody;
import de.dasshorty.recordbook.book.httpbodies.CreateBookBody;
import de.dasshorty.recordbook.book.week.httpbodies.BookWeekBody;
import de.dasshorty.recordbook.http.result.ErrorResult;
import de.dasshorty.recordbook.job.JobDto;
import de.dasshorty.recordbook.job.JobService;
import de.dasshorty.recordbook.user.UserDto;
import de.dasshorty.recordbook.user.UserService;
import de.dasshorty.recordbook.user.httpbodies.UserBody;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @Value("${query.limit}")
    private int defaultLimit;

    @Value("${query.offset}")
    private int defaultOffset;

    @Autowired
    public BookController(BookService bookService, UserService userService, JobService jobService) {
        this.bookService = bookService;
        this.userService = userService;
        this.jobService = jobService;
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<?> getBookById(@PathVariable("bookId") String bookId) {

        Optional<BookDto> optional = this.bookService.getBookById(UUID.fromString(bookId));

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("data not found", "bookId"));
        }

        return ResponseEntity.ok(BookBody.fromBook(optional.get()));
    }

    @GetMapping("/{bookId}/weeks")
    public ResponseEntity<?> getWeeks(@PathVariable("bookId") String bookId) {
        return ResponseEntity.ok(bookService.getBookWeeks(UUID.fromString(bookId)).stream()
                .map(week -> new BookWeekBody(week.getId(), UserBody.fromUser(week.getSignedFromTrainer()), week.getDays())).toList());
    }

    @PostMapping
    public ResponseEntity<?> createBook(@RequestBody @Valid CreateBookBody bookBody) {

        Optional<UserDto> traineeOptional = this.userService.retrieveUserById(bookBody.trainee());

        if (traineeOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("data not found", "trainee"));
        }

        List<Optional<UserDto>> optionalTrainers = bookBody.trainers().stream().map(this.userService::retrieveUserById).toList();

        if (optionalTrainers.stream().anyMatch(Optional::isEmpty)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("one data not found", "trainers"));
        }

        List<UserDto> list = optionalTrainers.stream().filter(Optional::isPresent).map(Optional::get).toList();

        Optional<JobDto> optionalJob = this.jobService.getJobById(bookBody.job());

        if (optionalJob.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("data not found", "job"));
        }

        return ResponseEntity.ok(this.bookService.createBook(new BookDto(traineeOptional.get(), list, optionalJob.get())));
    }

}
