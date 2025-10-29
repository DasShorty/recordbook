package de.dasshorty.recordbook.book.week.day;

import de.dasshorty.recordbook.job.qualifications.Qualification;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "days")
public class BookDay {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "date", columnDefinition = "date")
    private LocalDate date;

    @Column(name = "duration", columnDefinition = "decimal")
    private double duration;

    @Enumerated(EnumType.STRING)
    private Presence presence;

    @Enumerated(EnumType.STRING)
    private PresenceLocation presenceLocation;

    @ManyToMany
    private List<Qualification> qualifications;

    public BookDay(LocalDate date) {
        this.date = date;
    }

    public BookDay() {
    }

    public UUID getId() {
        return id;
    }

    public LocalDate getDate() {
        return date;
    }

    public double getDuration() {
        return duration;
    }

    public Presence getPresence() {
        return presence;
    }

    public PresenceLocation getPresenceLocation() {
        return presenceLocation;
    }

    public List<Qualification> getQualifications() {
        return qualifications;
    }
}
