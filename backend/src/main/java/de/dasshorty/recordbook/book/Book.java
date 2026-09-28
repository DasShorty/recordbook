package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.book.dto.BookDto;
import de.dasshorty.recordbook.book.week.BookWeek;
import de.dasshorty.recordbook.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "books")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Book {


    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private UUID publicId;

    @ManyToOne
    private User trainee;
    @ManyToOne
    private User trainer;
    @ManyToMany(fetch = FetchType.LAZY)
    private List<BookWeek> weeks;

    public Book(User trainee, User trainer) {
        this.trainee = trainee;
        this.trainer = trainer;
    }

    public BookDto toDto() {
        return new BookDto(
                this.publicId,
                this.trainee.toDto(),
                this.trainer.toDto()
        );
    }
}
