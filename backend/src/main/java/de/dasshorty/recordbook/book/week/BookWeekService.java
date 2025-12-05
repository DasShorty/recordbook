package de.dasshorty.recordbook.book.week;

import de.dasshorty.recordbook.authentication.jwt.JwtHandler;
import de.dasshorty.recordbook.book.Book;
import de.dasshorty.recordbook.book.BookService;
import de.dasshorty.recordbook.book.week.day.BookDay;
import de.dasshorty.recordbook.book.week.day.BookDayRepository;
import de.dasshorty.recordbook.book.week.dto.BookWeekDto;
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


//    @Transactional(readOnly = true)
//    public Optional<BookWeekDto> getByCalenderWeek(int calenderWeek, int year, UUID bookId) {
//        return bookWeekRepository.findByCalendarWeekAndBookId(calenderWeek, year, bookId).map(BookWeek::toDto);
//    }
//
//    @Transactional
//    public BookWeek createWeek(int calendarWeek, int year) {
//
//        if (this.bookWeekRepository.existsByCalendarWeekAndYear(calendarWeek, year)) {
//            throw new IllegalArgumentException("calendarWeek and year already belong to a created week!");
//        }
//
//        BookWeek bookWeek = BookWeek.createEmptyWeek(calendarWeek, year, this.createBookDays(calendarWeek, year));
//        return this.bookWeekRepository.save(bookWeek);
//    }

    @Transactional
    public Optional<BookWeekDto> getOrCreateWeekForBook(UUID bookId, int calendarWeek, int year, String accessToken) {
        // 1) try existing week
        var existing = findExistingWeek(calendarWeek, year, bookId);
        if (existing.isPresent()) {
            return existing;
        }

        // 2) extract user id from token
        UUID userId = extractUserIdOrThrow(accessToken);

        // 3) load book for user
        Book book = getBookForUserIdOrThrow(userId);

        // 4) create and attach new week
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

    private Book getBookForUserIdOrThrow(UUID userId) {
        var user = this.userService.retrieveUserEntityById(userId).orElseThrow(
                () -> new NotExistingException("user is not existing"));

        return this.bookService.getBookEntityByTrainee(user).orElseThrow(
                () -> new NotExistingException("book is not existing"));
    }

    // create and save week directly via repository to avoid calling public transactional method
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
            dayOfWeek = dayOfWeek.plusDays(1);

            bookDays.add(this.createBookDay(dayOfWeek.getDayOfMonth(), dayOfWeek.getMonthValue(), dayOfWeek.getYear()));

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
}
