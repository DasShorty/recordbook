package de.dasshorty.recordbook.job;

import de.dasshorty.recordbook.exception.AlreadyExistingException;
import de.dasshorty.recordbook.exception.NotExistingException;
import de.dasshorty.recordbook.http.result.OptionData;
import de.dasshorty.recordbook.job.dto.CreateJobDto;
import de.dasshorty.recordbook.job.dto.JobDto;
import de.dasshorty.recordbook.job.dto.UpdateJobDto;
import de.dasshorty.recordbook.job.qualifications.Qualification;
import de.dasshorty.recordbook.job.qualifications.QualificationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final QualificationRepository qualificationRepository;

    public JobService(JobRepository jobRepository, QualificationRepository qualificationRepository) {
        this.jobRepository = jobRepository;
        this.qualificationRepository = qualificationRepository;
    }

    public List<JobDto> getJobs(int limit, int offset) {
        return this.jobRepository.getJobs(limit, offset).stream()
                .map(Job::toDto)
                .toList();
    }

    @Transactional
    public JobDto createJob(CreateJobDto jobDto) {
        Job job = jobRepository.save(new Job(jobDto.name(), jobDto.description(), this.checkQualifications(jobDto.qualifications())));
        this.jobRepository.analyze();
        return job.toDto();
    }

    private List<Qualification> checkQualifications(List<UUID> qualifications) {
        List<Qualification> list = this.qualificationRepository.findAllById(qualifications);

        if (list.size() != qualifications.size()) {
            throw new EntityNotFoundException("One or more qualifications not found");
        }

        return list;
    }

    @Transactional
    public void deleteJob(UUID jobId) {
        this.jobRepository.deleteById(jobId);
        this.jobRepository.analyze();
    }

    public long count() {
        return this.jobRepository.getAnalyzedCount();
    }

    public Optional<JobDto> getJobById(UUID jobId) {
        return this.jobRepository.findById(jobId).map(Job::toDto);
    }

    // Internal method for service-to-service calls that need the entity
    public Optional<Job> getJobEntityById(UUID jobId) {
        return this.jobRepository.findById(jobId);
    }

    @Transactional
    public JobDto updateAssignedQualifications(UUID jobId, List<UUID> qualificationIds) {
        Optional<Job> optional = this.jobRepository.findById(jobId);

        if (optional.isEmpty()) {
            throw new NotExistingException("Job not found");
        }

        Job job = optional.get();
        job.setQualifications(this.checkQualifications(qualificationIds));

        return this.jobRepository.save(job).toDto();
    }

    @Transactional
    public JobDto updateJob(UpdateJobDto jobDto) {
        Optional<Job> optionalJob = this.jobRepository.findById(jobDto.id());

        if (optionalJob.isEmpty()) {
            throw new NotExistingException("Job not found");
        }

        Optional<Job> optional = this.jobRepository.findByName(jobDto.name());

        if (optional.isPresent() && !optional.get().getId().equals(jobDto.id())) {
            throw new AlreadyExistingException("name", jobDto.name());
        }

        Job job = optionalJob.get();
        job.setName(jobDto.name());
        job.setDescription(jobDto.description());
        job.setQualifications(this.checkQualifications(jobDto.qualifications()));

        Job savedJob = this.jobRepository.save(job);
        this.jobRepository.analyze();
        return savedJob.toDto();
    }

    protected Page<OptionData<String>> getJobOptions(String name, int offset, int limit) {
        return this.jobRepository.getJobOptions(name, Pageable.ofSize(limit).withPage(offset / limit));
    }


}
