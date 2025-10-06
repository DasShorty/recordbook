package de.dasshorty.recordbook.book.job;

import de.dasshorty.recordbook.book.job.qualifications.QualificationDto;
import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "qualified_jobs")
public class QualifiedJobDto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String description;
    @ManyToMany
    private List<QualificationDto> qualifications;

    public UUID getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public List<QualificationDto> getQualifications() {
        return qualifications;
    }
}
