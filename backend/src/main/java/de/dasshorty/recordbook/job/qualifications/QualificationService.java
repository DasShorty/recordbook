package de.dasshorty.recordbook.job.qualifications;

import de.dasshorty.recordbook.exception.AlreadyExistingException;
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

    public QualificationDto addQualification(@Valid QualificationDto qualification) {

        if (this.qualificationRepository.existsByName(qualification.getName())) {
            throw new AlreadyExistingException("name", qualification.getName());
        }

        QualificationDto savedQualification = this.qualificationRepository.save(qualification);
        this.qualificationRepository.analyze();
        return savedQualification;
    }

    public void removeQualification(UUID qualificationId) {
        this.qualificationRepository.deleteById(qualificationId);
        this.qualificationRepository.analyze();
    }

    public List<QualificationDto> getQualifications(int limit, int offset) {
        return this.qualificationRepository.getQualifications(limit, offset);
    }

    public Optional<QualificationDto> getQualification(UUID qualificationId) {
        return this.qualificationRepository.findById(qualificationId);
    }

    public long count() {
        return this.qualificationRepository.getAnalyzedCount();
    }
}
