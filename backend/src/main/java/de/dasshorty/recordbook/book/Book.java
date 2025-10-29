package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.book.httpbodies.BookDto;
import de.dasshorty.recordbook.book.week.BookWeek;
import de.dasshorty.recordbook.job.Job;
import de.dasshorty.recordbook.user.User;
import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne
    private User trainee;
    @ManyToMany
    private List<User> trainers;
    @ManyToOne
    private Job qualifiedJob;
    @ManyToMany(fetch = FetchType.LAZY)
    private List<BookWeek> weeks;

    public Book(User trainee, List<User> trainers, Job qualifiedJob) {
        this.trainee = trainee;
        this.trainers = trainers;
        this.qualifiedJob = qualifiedJob;
    }

    public Book() {
    }

    public UUID getId() {
        return id;
    }

    public User getTrainee() {
        return trainee;
    }

    public List<User> getTrainers() {
        return trainers;
    }

    public Job getQualifiedJob() {
        return qualifiedJob;
    }

    public List<BookWeek> getWeeks() {
        return weeks;
    }

    public BookDto toDto() {
        return new BookDto(this.id, this.trainee.getId(), trainers.stream().map(User::getId).toList(), qualifiedJob);
    }
}
