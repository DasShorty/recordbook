package de.dasshorty.recordbook.book.week;

import de.dasshorty.recordbook.authentication.jwt.JwtHandler;
import de.dasshorty.recordbook.book.Book;
import de.dasshorty.recordbook.book.BookService;
import de.dasshorty.recordbook.book.week.httpbodies.BookWeekDto;
import de.dasshorty.recordbook.book.week.httpbodies.CreateWeekDto;
import de.dasshorty.recordbook.http.handler.UserInputHandler;
import de.dasshorty.recordbook.http.result.ErrorResult;
import de.dasshorty.recordbook.user.User;
import de.dasshorty.recordbook.user.UserService;
import de.dasshorty.recordbook.user.dto.UserDto;
import jakarta.validation.Valid;
import jdk.jshell.spi.ExecutionControl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Calendar;
import java.util.Optional;
import java.util.UUID;

@RestController("/books/{bookId}/weeks")
public class BookWeekController {

    private final BookService bookService;
    private final BookWeekService bookWeekService;
    private final JwtHandler jwtHandler;
    private final UserService userService;

    @Autowired
    public BookWeekController(BookService bookService, BookWeekService bookWeekService, JwtHandler jwtHandler, UserService userService) {
        this.bookService = bookService;
        this.bookWeekService = bookWeekService;
        this.jwtHandler = jwtHandler;
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'TRAINER', 'TRAINEE')")
    public ResponseEntity<?> getWeeks(@PathVariable("bookId") String bookId) {
        return ResponseEntity.ok(bookService.getBookWeeks(UUID.fromString(bookId)).stream()
                .map(week -> new BookWeekDto(week.getId(), UserDto.fromUser(week.getSignedFromTrainer()), week.getDays())).toList());
    }

    @GetMapping("/{year}/{cw}")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'TRAINER', 'TRAINEE')")
    public ResponseEntity<?> getWeekByCalendarWeek(@PathVariable("bookId") String bookId, @PathVariable("cw") Integer calendarWeek,
                                                   @PathVariable("year") Integer year) {

        int convertedCalenderWeek = UserInputHandler.validInteger(calendarWeek) ? calendarWeek : -1;
        int convertedYear = UserInputHandler.validInteger(calendarWeek) ? calendarWeek : Calendar.getInstance().get(Calendar.YEAR);

        if (convertedCalenderWeek < 0 && convertedCalenderWeek >= Calendar.getInstance().getWeeksInWeekYear()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResult("invalid calendar week", "week"));
        }

        return ResponseEntity.of(this.bookWeekService.getByCalenderWeek(convertedCalenderWeek, convertedYear, UUID.fromString(bookId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'TRAINEE')")
    public ResponseEntity<?> createWeek(@PathVariable("bookId") String bookId, @CookieValue("access_token") String accessToken,
                                        @RequestBody @Valid CreateWeekDto createWeekBody) throws ExecutionControl.NotImplementedException {

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

        Optional<Book> optionalBook = this.bookService.getBookById(UUID.fromString(bookId));

        if (optionalBook.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("not found", "book"));
        }

        Book book = optionalBook.get();

        if (book.getTrainee() != user) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResult("invalid book id provided", "bookId"));
        }

        throw new ExecutionControl.NotImplementedException("Creating a week is not existing at the time!");
    }

}
