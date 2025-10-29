package de.dasshorty.recordbook.book.week;

import de.dasshorty.recordbook.book.week.day.BookDay;
import de.dasshorty.recordbook.user.User;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "weeks")
public class BookWeek {


    @ManyToMany(fetch = FetchType.EAGER)
    List<BookDay> days;
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne
    private User signedFromTrainer;

    private int calendarWeek;
    private int year;

    public UUID getId() {
        return id;
    }

    public List<BookDay> getDays() {
        return days;
    }

    public User getSignedFromTrainer() {
        return signedFromTrainer;
    }

    public BookWeek() {
    }

    public BookWeek(int calendarWeek, int year) {
        this.calendarWeek = calendarWeek;
        this.year = year;
    }

    public void setDays(List<BookDay> days) {
        this.days = days;
    }

    public static BookWeek createEmptyWeek(int calendarWeek, int year, List<BookDay> days) {

        BookWeek bookWeek = new BookWeek(calendarWeek, year);
        bookWeek.setDays(days);

        return bookWeek;
    }
}
