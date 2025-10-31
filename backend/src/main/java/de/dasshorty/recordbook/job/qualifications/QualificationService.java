package de.dasshorty.recordbook.job.qualifications;

import de.dasshorty.recordbook.exception.AlreadyExistingException;
import de.dasshorty.recordbook.exception.NotExistingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class QualificationService {

    private final QualificationRepository qualificationRepository;

    @Autowired
    public QualificationService(QualificationRepository qualificationRepository) {
        this.qualificationRepository = qualificationRepository;
    }

    public Qualification addQualification(@Valid Qualification qualification) {

        if (this.qualificationRepository.existsByName(qualification.getName())) {
            throw new AlreadyExistingException("name", qualification.getName());
        }

        Qualification savedQualification = this.qualificationRepository.save(qualification);
        this.qualificationRepository.analyze();
        return savedQualification;
    }

    public void removeQualification(UUID qualificationId) {
        this.qualificationRepository.deleteById(qualificationId);
        this.qualificationRepository.analyze();
    }

    public List<Qualification> getQualifications(int limit, int offset) {
        return this.qualificationRepository.getQualifications(limit, offset);
    }

    public Optional<Qualification> getQualification(UUID qualificationId) {
        return this.qualificationRepository.findById(qualificationId);
    }

    public long count() {
        return this.qualificationRepository.getAnalyzedCount();
    }

    public Qualification updateQualification(Qualification qualification) {

        if (!this.qualificationRepository.existsById(qualification.getId())) {
            throw new NotExistingException("qualification id is not existing!");
        }

        Optional<Qualification> optional = this.qualificationRepository.findByName(qualification.getName());
        if (optional.isPresent() && !optional.get().getId().equals(qualification.getId())) {
            throw new AlreadyExistingException("name", qualification.getName());
        }

        Qualification save = this.qualificationRepository.save(qualification);
        this.qualificationRepository.analyze();
        return save;
    }

    public List<Qualification> getByName(String name, int limit, int offset) {
        return this.qualificationRepository.getQualificationsByName(name, limit, offset);
    }

    public int countByName(String name) {
        return this.qualificationRepository.countByName(name);
    }
}
