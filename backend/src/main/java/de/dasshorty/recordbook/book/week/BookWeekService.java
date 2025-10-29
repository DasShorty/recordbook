package de.dasshorty.recordbook.book.week;

import de.dasshorty.recordbook.book.week.day.BookDay;
import org.springframework.stereotype.Service;

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

    public BookWeekService(BookWeekRepository bookWeekRepository) {
        this.bookWeekRepository = bookWeekRepository;
    }

    public List<BookWeek> getBookWeeks(int limit, int offset) {
        return this.bookWeekRepository.getWeeks(limit, offset);
    }

    public Optional<BookWeek> getWeekById(UUID id) {
        return this.bookWeekRepository.findById(id);
    }

    public List<BookWeek> getWeeksByBookId(UUID bookId) {
        return bookWeekRepository.findWeeksByBookId(bookId);
    }

    public Optional<BookWeek> getByCalenderWeek(int calenderWeek, int year, UUID bookId) {
        return bookWeekRepository.findByCalendarWeekAndBookId(calenderWeek, year, bookId);
    }

    public BookWeek createWeek(int calendarWeek, int year) {

        if (this.bookWeekRepository.existsByCalendarWeekAndYear(calendarWeek, year)) {
            throw new IllegalArgumentException("calendarWeek and year already belong to a created week!");
        }

        BookWeek bookWeek = new BookWeek(calendarWeek, year);
        bookWeek.setDays(this.createBookDays(calendarWeek, year));


        return bookWeek;
    }

    private List<BookDay> createBookDays(int calendarWeek, int year) {
        List<BookDay> bookDays = new ArrayList<>();

        LocalDate dayOfWeek = this.getMondayOfWeek(calendarWeek, year);

        for (int i = 0; i < 7; i++) {
            dayOfWeek = dayOfWeek.plusDays(1);

            bookDays.add(this.createBookDay(dayOfWeek.getDayOfMonth(), dayOfWeek.getMonthValue(), dayOfWeek.getYear()));

        }

        return bookDays;
    }

    private LocalDate getMondayOfWeek(int calendarWeek, int year) {
        return LocalDate.of(year, 1, 4).with(IsoFields.WEEK_OF_WEEK_BASED_YEAR, calendarWeek).with(
                ChronoField.DAY_OF_WEEK, DayOfWeek.MONDAY.getValue());
    }

    private BookDay createBookDay(int day, int month, int year) {
        return new BookDay(LocalDate.of(day, month, year));
    }
}
