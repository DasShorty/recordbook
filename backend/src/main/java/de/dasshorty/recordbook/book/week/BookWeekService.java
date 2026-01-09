package de.dasshorty.recordbook.book.week;

import de.dasshorty.recordbook.authentication.jwt.JwtHandler;
import de.dasshorty.recordbook.book.Book;
import de.dasshorty.recordbook.book.BookService;
import de.dasshorty.recordbook.book.week.day.BookDay;
import de.dasshorty.recordbook.book.week.day.BookDayRepository;
import de.dasshorty.recordbook.book.week.day.dto.UpdateBookDayDto;
import de.dasshorty.recordbook.book.week.dto.BookWeekDto;
import de.dasshorty.recordbook.book.week.dto.UpdateBookWeekDto;
import de.dasshorty.recordbook.exception.NotExistingException;
import de.dasshorty.recordbook.user.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoField;
import java.time.temporal.IsoFields;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookWeekService {

    private final BookWeekRepository bookWeekRepository;
    private final BookDayRepository bookDayRepository;
    private final JwtHandler jwtHandler;
    private final UserService userService;
    private final BookService bookService;

    public BookWeekService(BookWeekRepository bookWeekRepository, BookDayRepository bookDayRepository, JwtHandler jwtHandler, UserService userService, BookService bookService) {
        this.bookWeekRepository = bookWeekRepository;
        this.bookDayRepository = bookDayRepository;
        this.jwtHandler = jwtHandler;
        this.userService = userService;
        this.bookService = bookService;
    }

    @Transactional
    public Optional<BookWeekDto> getOrCreateWeekForBook(UUID bookId, int calendarWeek, int year) {

        var existing = findExistingWeek(calendarWeek, year, bookId);
        if (existing.isPresent()) {
            return existing;
        }

        Book book = getBookFromIdOrThrow(bookId);

        BookWeek newWeek = createAndAttachWeek(book, calendarWeek, year);

        return Optional.of(newWeek.toDto());
    }

    private Optional<BookWeekDto> findExistingWeek(int calendarWeek, int year, UUID bookId) {
        return this.bookWeekRepository.findByCalendarWeekAndBookId(calendarWeek, year, bookId)
                .map(BookWeek::toDto);
    }

    private UUID extractUserIdOrThrow(String accessToken) {
        return this.jwtHandler.extractUserId(accessToken)
                .orElseThrow(() -> new NotExistingException("user id is not existing"));
    }

    private Book getBookFromIdOrThrow(UUID bookId) {
        return this.bookService.getBookEntityById(bookId).orElseThrow(() ->
                new NotExistingException("book is not existing"));
    }

    private BookWeek createAndAttachWeek(Book book, int calendarWeek, int year) {
        if (this.bookWeekRepository.existsByCalendarWeekAndYear(calendarWeek, year)) {
            throw new IllegalArgumentException("calendarWeek and year already belong to a created week!");
        }

        BookWeek newWeek = BookWeek.createEmptyWeek(calendarWeek, year, this.createBookDays(calendarWeek, year));
        newWeek = this.bookWeekRepository.save(newWeek);

        var bookWeeks = new ArrayList<>(book.getWeeks());
        bookWeeks.add(newWeek);
        book.setWeeks(bookWeeks);

        this.bookService.updateBookEntity(book);

        return newWeek;
    }

    private List<BookDay> createBookDays(int calendarWeek, int year) {
        List<BookDay> bookDays = new ArrayList<>();

        LocalDate dayOfWeek = this.getMondayOfWeek(calendarWeek, year);

        for (int i = 0; i < 7; i++) {
            bookDays.add(this.createBookDay(dayOfWeek.getDayOfMonth(), dayOfWeek.getMonthValue(), dayOfWeek.getYear()));
            dayOfWeek = dayOfWeek.plusDays(1);
        }

        return this.bookDayRepository.saveAll(bookDays);
    }

    private LocalDate getMondayOfWeek(int calendarWeek, int year) {
        return LocalDate.of(year, 1, 4).with(IsoFields.WEEK_OF_WEEK_BASED_YEAR, calendarWeek).with(
                ChronoField.DAY_OF_WEEK, DayOfWeek.MONDAY.getValue());
    }

    private BookDay createBookDay(int day, int month, int year) {
        return new BookDay(LocalDate.of(year, month, day));
    }

    @Transactional
    public Optional<BookWeekDto> updateWeek(UUID bookId, UUID weekId, UpdateBookWeekDto updateDto) {
        BookWeek week = this.bookWeekRepository.findById(weekId)
                .orElseThrow(() -> new NotExistingException("week not found"));

        // Verify the week belongs to the specified book by checking if it exists in the book's weeks
        boolean weekBelongsToBook = this.bookWeekRepository
                .findByCalendarWeekAndBookId(week.getCalendarWeek(), week.getYear(), bookId)
                .map(w -> w.getId().equals(weekId))
                .orElse(false);

        if (!weekBelongsToBook) {
            throw new NotExistingException("week does not belong to the specified book");
        }

        // Update each day
        for (UpdateBookDayDto dayDto : updateDto.days()) {
            BookDay day = week.getDays().stream()
                    .filter(d -> d.getId().equals(dayDto.id()))
                    .findFirst()
                    .orElseThrow(() -> new NotExistingException("day not found"));

            day.setHours(dayDto.hours());
            day.setMinutes(dayDto.minutes());
            day.setPresence(dayDto.presence());
            day.setPresenceLocation(dayDto.presenceLocation());
            this.bookDayRepository.save(day);
        }

        // Save the updated week
        week.setText(updateDto.text());

        week = this.bookWeekRepository.save(week);
        return Optional.of(week.toDto());
    }

    public BookWeekDto submitWeek(UUID weekId) {
        var week = this.bookWeekRepository.findById(weekId).orElseThrow(() -> new NotExistingException("week not found"));

        if (week.getSignedFromTrainer() != null) {
            throw new IllegalStateException("week is already signed from the trainer");
        }

        if (week.isLocked()) {
            throw new IllegalStateException("week is already locked");
        }

        week.setLocked(true);
        week = this.bookWeekRepository.save(week);

        return week.toDto();
    }
}
