package de.dasshorty.recordbook.book.week;

import de.dasshorty.recordbook.book.week.day.BookDay;
import de.dasshorty.recordbook.user.User;
import jakarta.persistence.*;

import java.sql.Date;
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

    @Column
    private Date startDate;

    public Date getStartDate() {
        return startDate;
    }

    public UUID getId() {
        return id;
    }

    public List<BookDay> getDays() {
        return days;
    }

    public User getSignedFromTrainer() {
        return signedFromTrainer;
    }
}
