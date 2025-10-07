package de.dasshorty.recordbook.book.week;

import de.dasshorty.recordbook.book.week.day.BookDayDto;
import de.dasshorty.recordbook.user.UserDto;
import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "weeks")
public class BookWeekDto {


    @ManyToMany(fetch = FetchType.EAGER)
    List<BookDayDto> days;
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne
    private UserDto signedFromTrainer;

    public UUID getId() {
        return id;
    }

    public List<BookDayDto> getDays() {
        return days;
    }

    public UserDto getSignedFromTrainer() {
        return signedFromTrainer;
    }
}
