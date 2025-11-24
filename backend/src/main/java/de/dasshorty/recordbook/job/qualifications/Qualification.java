package de.dasshorty.recordbook.job.qualifications;

import de.dasshorty.recordbook.job.qualifications.dto.QualificationDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "qualifications")
@Getter
@Setter
public class Qualification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name", columnDefinition = "varchar(25)", unique = true)
    private String name;

    @Column(name = "description", columnDefinition = "varchar(100)")
    private String description;

    @Column(name = "minimum_duration", columnDefinition = "decimal")
    private double minimumDuration;

    public Qualification() {}

    public Qualification(
        String name,
        String description,
        double minimumDuration
    ) {
        this.name = name;
        this.description = description;
        this.minimumDuration = minimumDuration;
    }

    public Qualification(
        UUID id,
        String name,
        String description,
        double minimumDuration
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.minimumDuration = minimumDuration;
    }

    public QualificationDto toDto() {
        return new QualificationDto(
            this.id,
            this.name,
            this.description,
            this.minimumDuration
        );
    }

    public static Qualification fromDto(QualificationDto qualificationDto) {
        return new Qualification(
            qualificationDto.id(),
            qualificationDto.name(),
            qualificationDto.description(),
            qualificationDto.minimumDuration()
        );
    }
}
