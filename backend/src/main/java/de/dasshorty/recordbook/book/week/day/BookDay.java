package de.dasshorty.recordbook.book.week.day;

import de.dasshorty.recordbook.book.week.day.dto.BookDayDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "days")
@Getter
@Setter
@NoArgsConstructor
public class BookDay {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "date", columnDefinition = "date", nullable = false)
    private LocalDate date;

    @Column(name = "duration", columnDefinition = "decimal")
    private double duration;

    @Enumerated(EnumType.STRING)
    private Presence presence;

    @Enumerated(EnumType.STRING)
    private PresenceLocation presenceLocation;

    public BookDay(LocalDate date) {
        this.date = date;
    }

    public BookDayDto toDto() {
        return new BookDayDto(
                this.id,
                this.date,
                this.duration,
                this.presence,
                this.presenceLocation
        );
    }
}
