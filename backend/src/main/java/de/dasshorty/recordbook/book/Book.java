package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.book.dto.BookDto;
import de.dasshorty.recordbook.book.week.BookWeek;
import de.dasshorty.recordbook.job.Job;
import de.dasshorty.recordbook.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "books")
@Getter
@Setter
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne
    private User trainee;
    @ManyToMany(fetch = FetchType.LAZY)
    private List<User> trainers;
    @ManyToOne(fetch = FetchType.LAZY)
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

    public BookDto toDto() {
        return new BookDto(
                this.id,
                this.trainee.toDto(),
                this.trainers.stream().map(User::toDto).toList(),
                this.qualifiedJob.toDto()
        );
    }
}
