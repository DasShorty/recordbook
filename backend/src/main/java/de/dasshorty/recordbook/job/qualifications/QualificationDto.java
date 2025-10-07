package de.dasshorty.recordbook.job.qualifications;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.util.UUID;

@Entity
@Table(name = "qualifications")
public class QualificationDto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @NotBlank(message = "Name is required")
    @Column(name = "name", columnDefinition = "varchar(25)", unique = true)
    private String name;
    @Column(name = "description", columnDefinition = "varchar(100)")
    private String description;
    @Min(value = 1, message = "minimum one hour required")
    @Max(value = 24, message = "maximum of 24 hours reached")
    @Positive(message = "Only positive numbers allowed")
    @Column(name = "minimum_duration", columnDefinition = "decimal")
    private double minimumDuration;

    public QualificationDto() {
    }

    public QualificationDto(String name, String description, double minimumDuration) {
        this.name = name;
        this.description = description;
        this.minimumDuration = minimumDuration;
    }

    public double getMinimumDuration() {
        return minimumDuration;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }
}
