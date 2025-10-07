package de.dasshorty.recordbook.job;

import de.dasshorty.recordbook.exception.AlreadyExistingException;
import de.dasshorty.recordbook.exception.NotExistingException;
import de.dasshorty.recordbook.job.qualifications.QualificationDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class JobService {

    private final JobRepository jobRepository;

    @Autowired
    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public List<JobDto> getJobs(int limit, int offset) {
        return this.jobRepository.getJobs(limit, offset);
    }

    public JobDto createJob(@Valid JobDto jobDto) {

        if (this.jobRepository.existsByName(jobDto.getName())) {
            throw new AlreadyExistingException("name", jobDto.getName());
        }

        JobDto savedJob = this.jobRepository.save(jobDto);
        this.jobRepository.analyze();
        return savedJob;
    }

    public void deleteJob(UUID jobId) {
        this.jobRepository.deleteById(jobId);
        this.jobRepository.analyze();
    }

    public long count() {
        return this.jobRepository.getAnalyzedCount();
    }

    public Optional<JobDto> getJobById(UUID jobId) {
        return this.jobRepository.findById(jobId);
    }

    public JobDto updateAssignedQualifications(UUID jobId, List<QualificationDto> qualifications) {

        Optional<JobDto> optional = this.jobRepository.findById(jobId);

        if (optional.isEmpty()) {
            throw new NotExistingException("Job not found");
        }

        JobDto jobDto = optional.get();

        jobDto.setQualifications(qualifications);


    }


}
