package de.dasshorty.recordbook.book.week;

import de.dasshorty.recordbook.authentication.jwt.JwtHandler;
import de.dasshorty.recordbook.book.BookService;
import de.dasshorty.recordbook.book.dto.BookDto;
import de.dasshorty.recordbook.book.week.dto.BookWeekDto;
import de.dasshorty.recordbook.book.week.dto.CreateWeekDto;
import de.dasshorty.recordbook.http.handler.UserInputHandler;
import de.dasshorty.recordbook.http.result.ErrorResult;
import de.dasshorty.recordbook.user.UserService;
import de.dasshorty.recordbook.user.dto.UserDto;
import jakarta.validation.Valid;
import jdk.jshell.spi.ExecutionControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/books/{bookId}/weeks")
public class BookWeekController {

    private final BookService bookService;
    private final BookWeekService bookWeekService;
    private final JwtHandler jwtHandler;
    private final UserService userService;

    public BookWeekController(BookService bookService, BookWeekService bookWeekService,
                             JwtHandler jwtHandler, UserService userService) {
        this.bookService = bookService;
        this.bookWeekService = bookWeekService;
        this.jwtHandler = jwtHandler;
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'TRAINER', 'TRAINEE')")
    public ResponseEntity<List<BookWeekDto>> getWeeks(@PathVariable UUID bookId) {
        List<BookWeekDto> weeks = bookService.getBookWeeks(bookId).stream()
                .map(week -> new BookWeekDto(
                        week.getId(),
                        week.getSignedFromTrainer() != null ? week.getSignedFromTrainer().toDto() : null,
                        week.getDays()
                ))
                .toList();
        return ResponseEntity.ok(weeks);
    }

    @GetMapping("/{year}/{cw}")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'TRAINER', 'TRAINEE')")
    public ResponseEntity<?> getWeekByCalendarWeek(
            @PathVariable UUID bookId,
            @PathVariable("cw") Integer calendarWeek,
            @PathVariable Integer year) {

        int convertedCalenderWeek = UserInputHandler.validInteger(calendarWeek) ? calendarWeek : -1;
        int convertedYear = UserInputHandler.validInteger(year) ? year : Calendar.getInstance().get(Calendar.YEAR);

        if (convertedCalenderWeek < 0 || convertedCalenderWeek >= Calendar.getInstance().getWeeksInWeekYear()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResult("invalid calendar week", "week"));
        }

        Optional<BookWeek> week = this.bookWeekService.getByCalenderWeek(
                convertedCalenderWeek, convertedYear, bookId);

        return ResponseEntity.of(week.map(bookWeek -> new BookWeekDto(
                bookWeek.getId(),
                bookWeek.getSignedFromTrainer() != null ? bookWeek.getSignedFromTrainer().toDto() : null,
                bookWeek.getDays()
        )));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'TRAINEE')")
    public ResponseEntity<?> createWeek(
            @PathVariable UUID bookId,
            @CookieValue("access_token") String accessToken,
            @RequestBody @Valid CreateWeekDto createWeekBody) throws ExecutionControl.NotImplementedException {

        Optional<UUID> optional = this.jwtHandler.extractUserId(accessToken);

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResult("not found", "access_token"));
        }

        UUID userId = optional.get();
        Optional<UserDto> optionalUser = this.userService.retrieveUserById(userId);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResult("not found", "user"));
        }

        UserDto user = optionalUser.get();
        Optional<BookDto> optionalBook = this.bookService.getBookById(bookId);

        if (optionalBook.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResult("not found", "book"));
        }

        BookDto book = optionalBook.get();

        if (!book.trainee().id().equals(user.id())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResult("invalid book id provided", "bookId"));
        }

        throw new ExecutionControl.NotImplementedException("Creating a week is not existing at the time!");
    }

}
