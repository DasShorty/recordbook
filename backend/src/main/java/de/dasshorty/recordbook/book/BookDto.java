package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.book.job.QualifiedJobDto;
import de.dasshorty.recordbook.book.week.BookWeekDto;
import de.dasshorty.recordbook.user.UserDto;
import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "books")
public class BookDto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    private UserDto trainee;

    @ManyToMany
    private List<UserDto> trainers;

    @ManyToOne
    private QualifiedJobDto qualifiedJob;

    @ManyToMany
    private List<BookWeekDto> weeks;

    public UserDto getTrainee() {
        return trainee;
    }

    public List<UserDto> getTrainers() {
        return trainers;
    }

    public QualifiedJobDto getQualifiedJob() {
        return qualifiedJob;
    }

    public List<BookWeekDto> getWeeks() {
        return weeks;
    }
}
