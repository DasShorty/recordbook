package de.dasshorty.recordbook.book.week.day;

import de.dasshorty.recordbook.job.qualifications.QualificationDto;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "days")
public class BookDayDto {

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
    private List<QualificationDto> qualifications;

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

    public List<QualificationDto> getQualifications() {
        return qualifications;
    }
}
