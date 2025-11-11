package de.dasshorty.recordbook.job;

import de.dasshorty.recordbook.http.handler.UserInputHandler;
import de.dasshorty.recordbook.http.result.OptionData;
import de.dasshorty.recordbook.http.result.QueryResult;
import de.dasshorty.recordbook.job.dto.CreateJobDto;
import de.dasshorty.recordbook.job.dto.JobDto;
import de.dasshorty.recordbook.job.dto.UpdateJobDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

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
    public ResponseEntity<QueryResult<JobDto>> getJobs(
            @RequestParam(name = "limit", required = false) Integer limit,
            @RequestParam(name = "offset", required = false) Integer offset) {

        int convertedLimit = UserInputHandler.validInteger(limit) ? limit : defaultLimit;
        int convertedOffset = UserInputHandler.validInteger(offset) ? offset : defaultOffset;

        List<JobDto> jobs = this.jobService.getJobs(convertedLimit, convertedOffset);

        return ResponseEntity.ok(new QueryResult<>(this.jobService.count(), convertedLimit, convertedOffset, jobs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJobById(@PathVariable("id") UUID id) {
        return ResponseEntity.of(this.jobService.getJobById(id));
    }

    @PostMapping
    public ResponseEntity<JobDto> createJob(@RequestBody @Valid CreateJobDto job) {
        JobDto createdJob = this.jobService.createJob(job);
        return ResponseEntity.created(URI.create(this.applicationUrl + "/jobs/" + createdJob.id())).body(createdJob);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable("id") UUID id) {
        this.jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping
    public ResponseEntity<JobDto> updateJob(@RequestBody @Valid UpdateJobDto jobDto) {
        return ResponseEntity.ok(this.jobService.updateJob(jobDto));
    }

    @PatchMapping("/{id}/qualifications")
    public ResponseEntity<JobDto> updateAssignedQualifications(
            @PathVariable("id") UUID id,
            @RequestBody @Valid List<UUID> qualificationIds) {
        return ResponseEntity.ok(this.jobService.updateAssignedQualifications(id, qualificationIds));
    }

    @GetMapping("options")
    public ResponseEntity<?> getJobOptions(@RequestParam("limit") Integer limit,
                                           @RequestParam("offset") Integer offset,
                                           @RequestParam("name") String filter) {

        int convertedLimit = UserInputHandler.validInteger(limit) ? limit : defaultLimit;
        int convertedOffset = UserInputHandler.validInteger(offset) ? offset : defaultOffset;

        Page<OptionData<String>> jobOptions = this.jobService.getJobOptions(filter == null ? "" : filter, convertedOffset, convertedLimit);

        return ResponseEntity.ok(new QueryResult<>(jobOptions.getTotalElements(), convertedLimit, convertedOffset, jobOptions.getContent()));
    }
}
