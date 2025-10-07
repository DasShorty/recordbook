package de.dasshorty.recordbook.job;

import de.dasshorty.recordbook.http.handler.UserInputHandler;
import de.dasshorty.recordbook.http.result.ErrorResult;
import de.dasshorty.recordbook.http.result.QueryResult;
import de.dasshorty.recordbook.job.qualifications.QualificationDto;
import de.dasshorty.recordbook.job.qualifications.QualificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService jobService;
    private final QualificationService qualificationService;

    @Value("${query.limit}")
    private int defaultLimit;

    @Value("${query.offset}")
    private int defaultOffset;

    @Autowired
    public JobController(JobService jobService, QualificationService qualificationService) {
        this.jobService = jobService;
        this.qualificationService = qualificationService;
    }

    @GetMapping
    public ResponseEntity<?> getJobs(@RequestParam(name = "limit", required = false) Integer limit,
                                     @RequestParam(name = "offset", required = false) Integer offset) {

        int convertedLimit = UserInputHandler.validInteger(limit) ? limit : defaultLimit;
        int convertedOffset = UserInputHandler.validInteger(offset) ? offset : defaultOffset;

        List<JobDto> jobs = this.jobService.getJobs(convertedLimit, convertedOffset);

        return ResponseEntity.ok(new QueryResult<>(this.jobService.count(), convertedLimit, convertedOffset, jobs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable("id") String id) {
        return ResponseEntity.of(this.jobService.getJobById(UUID.fromString(id)));
    }

    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody @Valid JobDto jobDto) {
        return ResponseEntity.ok(this.jobService.createJob(jobDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable("id") String id) {
        this.jobService.deleteJob(UUID.fromString(id));
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/qualifications")
    public ResponseEntity<?> updateAssignedQualifications(@PathVariable("id") String id,
                                                          @RequestBody List<String> qualificationIds) {

        UUID uid = UUID.fromString(id);

        Optional<JobDto> optional = this.jobService.getJobById(uid);

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("job not found", "id"));
        }

        List<Optional<QualificationDto>> list = qualificationIds.stream()
                .map(UUID::fromString)
                .map(this.qualificationService::getQualification)
                .toList();

        if (list.stream().anyMatch(Optional::isEmpty)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("one or more qualifications not " +
                    "found", "qualifications"));
        }

        List<QualificationDto> qualificationDtos = list.stream().filter(Optional::isPresent)
                .map(Optional::get)
                .toList();

        this.jobService.upd


    }
}
