package de.dasshorty.recordbook.book.week.day;

import de.dasshorty.recordbook.book.week.day.dto.BookDayDto;
import de.dasshorty.recordbook.job.qualifications.Qualification;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
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

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "day_qualifications",
            joinColumns = @JoinColumn(name = "day_id"),
            inverseJoinColumns = @JoinColumn(name = "qualification_id")
    )
    private List<Qualification> qualifications = new ArrayList<>();

    public BookDay(LocalDate date) {
        this.date = date;
    }

    public BookDayDto toDto() {
        return new BookDayDto(
                this.id,
                this.date,
                this.duration,
                this.presence,
                this.presenceLocation,
                this.qualifications.stream()
                        .map(Qualification::toDto)
                        .toList()
        );
    }
}
