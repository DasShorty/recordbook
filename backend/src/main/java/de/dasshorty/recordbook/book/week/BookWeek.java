package de.dasshorty.recordbook.book.week;

import de.dasshorty.recordbook.book.week.day.BookDay;
import de.dasshorty.recordbook.book.week.day.dto.BookDayDto;
import de.dasshorty.recordbook.book.week.dto.BookWeekDto;
import de.dasshorty.recordbook.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "weeks",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_week_id_calendarweek_year",
                columnNames = {"id", "calendar_week", "year"}
        ))
@Getter
@Setter
@NoArgsConstructor
public class BookWeek {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User signedFromTrainer;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "week_days",
            joinColumns = @JoinColumn(name = "week_id"),
            inverseJoinColumns = @JoinColumn(name = "day_id")
    )
    private List<BookDay> days = new ArrayList<>();

    @Column(nullable = false)
    private int calendarWeek;

    @Column(nullable = false)
    private int year;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean locked = false;

    @Column(columnDefinition = "text")
    private String text;

    public BookWeek(int calendarWeek, int year) {
        this.calendarWeek = calendarWeek;
        this.year = year;
    }

    public static BookWeek createEmptyWeek(int calendarWeek, int year, List<BookDay> days) {
        BookWeek bookWeek = new BookWeek(calendarWeek, year);
        bookWeek.setDays(days != null ? new ArrayList<>(days) : new ArrayList<>());
        return bookWeek;
    }

    public BookWeekDto toDto() {
        return new BookWeekDto(
                this.id,
                this.signedFromTrainer == null ? null : this.signedFromTrainer.toDto(),
                this.text,
                this.year,
                this.calendarWeek,
                this.locked,
                this.days.stream().map(BookDay::toDto).sorted(Comparator.comparing(BookDayDto::date)).toList()
        );
    }
}
