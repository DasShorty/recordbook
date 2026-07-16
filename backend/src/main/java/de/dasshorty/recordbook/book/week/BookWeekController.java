package de.dasshorty.recordbook.book.week;

import de.dasshorty.recordbook.book.Book;
import de.dasshorty.recordbook.book.BookService;
import de.dasshorty.recordbook.book.week.dto.BookWeekDto;
import de.dasshorty.recordbook.book.week.dto.UpdateBookWeekCommand;
import de.dasshorty.recordbook.http.handler.UserInputHandler;
import de.dasshorty.recordbook.http.result.ErrorResult;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Calendar;
import java.util.UUID;

@RestController
@RequestMapping("/books")
public class BookWeekController {

    private final BookService bookService;
    private final BookWeekService bookWeekService;

    public BookWeekController(BookService bookService, BookWeekService bookWeekService) {
        this.bookService = bookService;
        this.bookWeekService = bookWeekService;
    }

    @GetMapping("/{bookId}/weeks")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'TRAINER', 'TRAINEE')")
    public ResponseEntity<Page<BookWeekDto>> getWeeks(@PathVariable("bookId") UUID book, @PageableDefault Pageable pageable) {
        return ResponseEntity.ok(bookService.getBookWeeks(book, pageable).map(BookWeek::toDto));
    }

    @GetMapping("/{bookId}/weeks/{year}/{cw}")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'TRAINER', 'TRAINEE')")
    public ResponseEntity<?> getWeekByCalendarWeek(@PathVariable("bookId") Book book, @PathVariable("cw") @Min(1) Integer calendarWeek, @PathVariable Integer year) {
        int convertedYear = UserInputHandler.validInteger(year) ? year : Calendar.getInstance().get(Calendar.YEAR);

        if (calendarWeek < 0 || calendarWeek > Calendar.getInstance().getWeeksInWeekYear()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResult("invalid calendar week", "week"));
        }

        var week = this.bookWeekService.getOrCreateWeekForBook(book, calendarWeek, convertedYear);
        return ResponseEntity.of(week);
    }

    @PutMapping("/{bookId}/weeks/{weekId}")
    @PreAuthorize("hasAnyAuthority('TRAINEE')")
    public ResponseEntity<?> updateWeek(@PathVariable UUID bookId, @PathVariable("weekId") BookWeek bookWeek, @Valid @RequestBody UpdateBookWeekCommand updateDto) {
        var updatedWeek = this.bookWeekService.updateWeek(bookId, bookWeek, updateDto);
        return ResponseEntity.of(updatedWeek);
    }

    @PatchMapping("/weeks/{weekId}/submit")
    @PreAuthorize("hasAnyAuthority('TRAINEE')")
    public ResponseEntity<?> submitWeek(@PathVariable UUID weekId) {
        return ResponseEntity.ok(this.bookWeekService.submitWeek(weekId));
    }

    @PatchMapping("/weeks/{weekId}/accept")
    @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMINISTRATOR')")
    public ResponseEntity<?> submitWeek(@PathVariable("weekId") BookWeek bookWeek, @CookieValue("access_token") String accessToken) {
        return ResponseEntity.ok(this.bookWeekService.acceptWeek(bookWeek, accessToken));
    }

    @PatchMapping("/weeks/{weekId}/deny")
    @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMINISTRATOR')")
    public ResponseEntity<?> denyWeek(@PathVariable("weekId") BookWeek bookWeek) {
        return ResponseEntity.ok(this.bookWeekService.denyWeek(bookWeek));
    }

    @DeleteMapping("/weeks/{weekId}")
    @PreAuthorize("hasAnyAuthority('TRAINEE', 'ADMINISTRATOR')")
    public ResponseEntity<?> deleteWeek(@PathVariable UUID weekId) {
        this.bookWeekService.deleteWeek(weekId);
        return ResponseEntity.noContent().build();
    }
}
