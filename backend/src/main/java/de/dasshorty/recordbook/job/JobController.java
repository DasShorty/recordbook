package de.dasshorty.recordbook.job;

import de.dasshorty.recordbook.job.dto.CreateJobDto;
import de.dasshorty.recordbook.job.dto.JobDto;
import de.dasshorty.recordbook.job.dto.UpdateJobDto;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService jobService;

    @Value("${query.limit}")
    private int defaultLimit;

    @Value("${query.offset}")
    private int defaultOffset;

    @Value("${application.url}")
    private String applicationUrl;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<Page<JobDto>> getJobs(
        @PageableDefault Pageable pageable
    ) {
        return ResponseEntity.ok(this.jobService.getJobs(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJobById(@PathVariable("id") UUID id) {
        return ResponseEntity.of(this.jobService.getJobById(id));
    }

    @PostMapping
    public ResponseEntity<JobDto> createJob(
        @RequestBody @Valid CreateJobDto job
    ) {
        JobDto createdJob = this.jobService.createJob(job);
        return ResponseEntity.created(
            URI.create(this.applicationUrl + "/jobs/" + createdJob.id())
        ).body(createdJob);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable("id") UUID id) {
        this.jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping
    public ResponseEntity<JobDto> updateJob(
        @RequestBody @Valid UpdateJobDto jobDto
    ) {
        return ResponseEntity.ok(this.jobService.updateJob(jobDto));
    }

    @PatchMapping("/{id}/qualifications")
    public ResponseEntity<JobDto> updateAssignedQualifications(
        @PathVariable("id") UUID id,
        @RequestBody @Valid List<UUID> qualificationIds
    ) {
        return ResponseEntity.ok(
            this.jobService.updateAssignedQualifications(id, qualificationIds)
        );
    }

    @GetMapping("options")
    public ResponseEntity<?> getJobOptions(
        @PageableDefault Pageable pageable,
        @RequestParam("name") String filter
    ) {
        return ResponseEntity.ok(
            this.jobService.getJobOptions(
                filter == null ? "" : filter,
                pageable
            )
        );
    }
}
