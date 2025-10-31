package de.dasshorty.recordbook.job;

import de.dasshorty.recordbook.exception.AlreadyExistingException;
import de.dasshorty.recordbook.exception.NotExistingException;
import de.dasshorty.recordbook.job.dto.CreateJobDto;
import de.dasshorty.recordbook.job.dto.UpdateJobDto;
import de.dasshorty.recordbook.job.qualifications.Qualification;
import de.dasshorty.recordbook.job.qualifications.QualificationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final QualificationRepository qualificationRepository;

    @Autowired
    public JobService(JobRepository jobRepository, QualificationRepository qualificationRepository) {
        this.jobRepository = jobRepository;
        this.qualificationRepository = qualificationRepository;
    }

    public List<Job> getJobs(int limit, int offset) {
        return this.jobRepository.getJobs(limit, offset);
    }

    public Job createJob(CreateJobDto jobDto) {
        Job job = jobRepository.save(new Job(jobDto.name(), jobDto.description(), this.checkQualifications(jobDto.qualifications())));
        this.jobRepository.analyze();
        return job;
    }

    private List<Qualification> checkQualifications(List<UUID> qualifications) {
        List<Qualification> list = this.qualificationRepository.findAllById(qualifications);

        if (list.size() != qualifications.size()) {
            throw new EntityNotFoundException("One or more qualifications not found");
        }

        return list;
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

    public Job updateJob(UpdateJobDto job) {

        Optional<Job> optionalJob = this.jobRepository.findById(job.id());

        if (optionalJob.isEmpty()) {
            throw new NotExistingException("Job not found");
        }

        Optional<Job> optional = this.jobRepository.findByName(job.name());

        if (optional.isPresent() && !optional.get().getId().equals(job.id())) {
            throw new AlreadyExistingException("name", job.name());
        }


        Job savedJob = this.jobRepository.save(new Job(job.id(), job.name(), job.description(), this.checkQualifications(job.qualifications())));
        this.jobRepository.analyze();
        return savedJob;
    }


}
