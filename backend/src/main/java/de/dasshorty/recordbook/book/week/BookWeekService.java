package de.dasshorty.recordbook.book.week;

import de.dasshorty.recordbook.book.week.day.BookDay;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public BookWeekService(BookWeekRepository bookWeekRepository) {
        this.bookWeekRepository = bookWeekRepository;
    }

    @Transactional(readOnly = true)
    public Page<BookWeek> getBookWeeks(Pageable pageable) {
        return this.bookWeekRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Optional<BookWeek> getWeekById(UUID id) {
        return this.bookWeekRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Page<BookWeek> getWeeksByBookId(UUID bookId, Pageable pageable) {
        return bookWeekRepository.findWeeksByBookId(bookId, pageable);
    }

    @Transactional(readOnly = true)
    public Optional<BookWeek> getByCalenderWeek(int calenderWeek, int year, UUID bookId) {
        return bookWeekRepository.findByCalendarWeekAndBookId(calenderWeek, year, bookId);
    }

    @Transactional
    public BookWeek createWeek(int calendarWeek, int year) {

        if (this.bookWeekRepository.existsByCalendarWeekAndYear(calendarWeek, year)) {
            throw new IllegalArgumentException("calendarWeek and year already belong to a created week!");
        }

        BookWeek bookWeek = new BookWeek(calendarWeek, year);
        bookWeek.setDays(this.createBookDays(calendarWeek, year));


        return this.bookWeekRepository.save(bookWeek);
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
