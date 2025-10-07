package de.dasshorty.recordbook.job;

import de.dasshorty.recordbook.job.qualifications.QualificationDto;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "jobs")
public class JobDto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @NotBlank(message = "Name is required")
    @Column(name = "name", unique = true, nullable = false)
    private String name;
    @NotBlank(message = "Description is required")
    @Column(name = "description")
    private String description;
    @Size(min = 1, message = "A minimum of one qualification is required for a qualified job")
    @ManyToMany
    private List<QualificationDto> qualifications;

    public String getName() {
        return name;
    }

    public UUID getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public List<QualificationDto> getQualifications() {
        return qualifications;
    }

    public void setQualifications(List<QualificationDto> qualifications) {
        this.qualifications = qualifications;
    }
}
