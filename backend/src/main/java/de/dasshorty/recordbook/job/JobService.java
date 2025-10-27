package de.dasshorty.recordbook.job;

import de.dasshorty.recordbook.exception.AlreadyExistingException;
import de.dasshorty.recordbook.exception.NotExistingException;
import de.dasshorty.recordbook.job.qualifications.Qualification;
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

    public List<Job> getJobs(int limit, int offset) {
        return this.jobRepository.getJobs(limit, offset);
    }

    public Job createJob(@Valid Job job) {

        if (this.jobRepository.existsByName(job.getName())) {
            throw new AlreadyExistingException("name", job.getName());
        }

        Job savedJob = this.jobRepository.save(job);
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

    public Optional<Job> getJobById(UUID jobId) {
        return this.jobRepository.findById(jobId);
    }

    public Job updateAssignedQualifications(UUID jobId, List<Qualification> qualifications) {

        Optional<Job> optional = this.jobRepository.findById(jobId);

        if (optional.isEmpty()) {
            throw new NotExistingException("Job not found");
        }

        Job job = optional.get();

        job.setQualifications(qualifications);

        return this.jobRepository.save(job);
    }


}
