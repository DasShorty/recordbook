package de.dasshorty.recordbook.book.job.qualifications;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.util.UUID;

@Entity
@Table(name = "qualifications")
public class QualificationDto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Name is required")
    @Column(name = "name", columnDefinition = "varchar(25)")
    private String name;
    @Column(name = "description", columnDefinition = "varchar(100)")
    private String description;
    @Min(value = 1, message = "minimum one hour required")
    @Max(value = 24, message = "maximum of 24 hours reached")
    @Positive(message = "Only positive numbers allowed")
    @Column(name = "minimum_duration", columnDefinition = "decimal")
    private double minimumDuration;

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
