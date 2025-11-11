package de.dasshorty.recordbook.job;

import de.dasshorty.recordbook.job.dto.JobDto;
import de.dasshorty.recordbook.job.qualifications.Qualification;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Name is required")
    @Column(name = "name", unique = true, nullable = false)
    private String name;

    @NotBlank(message = "Description is required")
    @Column(name = "description", nullable = false)
    private String description;

    @Size(min = 1, message = "A minimum of one qualification is required for a qualified job")
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "job_qualifications",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "qualification_id")
    )
    private List<Qualification> qualifications = new ArrayList<>();

    public Job(String name, String description, List<Qualification> qualifications) {
        this.name = name;
        this.description = description;
        this.qualifications = qualifications != null ? new ArrayList<>(qualifications) : new ArrayList<>();
    }

    public JobDto toDto() {
        return new JobDto(
                this.id,
                this.name,
                this.description,
                this.qualifications.stream()
                        .map(Qualification::toDto)
                        .toList()
        );
    }
}
