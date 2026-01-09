package de.dasshorty.recordbook.book.week;

import de.dasshorty.recordbook.book.BookService;
import de.dasshorty.recordbook.book.week.dto.BookWeekDto;
import de.dasshorty.recordbook.book.week.dto.UpdateBookWeekDto;
import de.dasshorty.recordbook.exception.NotExistingException;
import de.dasshorty.recordbook.http.handler.UserInputHandler;
import de.dasshorty.recordbook.http.result.ErrorResult;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public ResponseEntity<Page<BookWeekDto>> getWeeks(@PathVariable UUID bookId) {
        return ResponseEntity.ok(bookService.getBookWeeks(bookId, Pageable.ofSize(7)).map(BookWeek::toDto));
    }

    @GetMapping("/{bookId}/weeks/{year}/{cw}")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'TRAINER', 'TRAINEE')")
    public ResponseEntity<?> getWeekByCalendarWeek(@PathVariable UUID bookId, @PathVariable("cw") @Min(1) Integer calendarWeek, @PathVariable Integer year) {
        int convertedYear = UserInputHandler.validInteger(year) ? year : Calendar.getInstance().get(Calendar.YEAR);

        if (calendarWeek < 0 || calendarWeek > Calendar.getInstance().getWeeksInWeekYear()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResult("invalid calendar week", "week"));
        }

        try {
            var week = this.bookWeekService.getOrCreateWeekForBook(bookId, calendarWeek, convertedYear);
            return ResponseEntity.of(week);
        } catch (NotExistingException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("not found", e.getMessage()));
        }
    }

    @PutMapping("/{bookId}/weeks/{weekId}")
    @PreAuthorize("hasAnyAuthority('TRAINEE')")
    public ResponseEntity<?> updateWeek(@PathVariable UUID bookId, @PathVariable UUID weekId, @Valid @RequestBody UpdateBookWeekDto updateDto) {
        try {
            var updatedWeek = this.bookWeekService.updateWeek(bookId, weekId, updateDto);
            return ResponseEntity.of(updatedWeek);
        } catch (NotExistingException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("not found", e.getMessage()));
        }
    }

    @PatchMapping("/weeks/{weekId}/submit")
    @PreAuthorize("hasAnyAuthority('TRAINEE')")
    public ResponseEntity<?> submitWeek(@PathVariable UUID weekId) {
        return ResponseEntity.ok(this.bookWeekService.submitWeek(weekId));
    }
}
