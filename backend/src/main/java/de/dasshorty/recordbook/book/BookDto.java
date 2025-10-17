package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.book.week.BookWeekDto;
import de.dasshorty.recordbook.job.JobDto;
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
    private JobDto qualifiedJob;
    @ManyToMany
    private List<BookWeekDto> weeks;

    public BookDto(UserDto trainee, List<UserDto> trainers, JobDto qualifiedJob) {
        this.trainee = trainee;
        this.trainers = trainers;
        this.qualifiedJob = qualifiedJob;
    }

    public BookDto() {
    }

    public UUID getId() {
        return id;
    }

    public UserDto getTrainee() {
        return trainee;
    }

    public List<UserDto> getTrainers() {
        return trainers;
    }

    public JobDto getQualifiedJob() {
        return qualifiedJob;
    }

    public List<BookWeekDto> getWeeks() {
        return weeks;
    }
}
