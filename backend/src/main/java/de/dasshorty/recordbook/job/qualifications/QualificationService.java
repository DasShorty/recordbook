package de.dasshorty.recordbook.job.qualifications;

import de.dasshorty.recordbook.exception.AlreadyExistingException;
import de.dasshorty.recordbook.exception.NotExistingException;
import de.dasshorty.recordbook.http.result.OptionData;
import de.dasshorty.recordbook.job.qualifications.dto.QualificationDto;
import de.dasshorty.recordbook.job.qualifications.dto.UpdateQualificationDto;
import jakarta.validation.Valid;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class QualificationService {

    private final QualificationRepository qualificationRepository;

    @Autowired
    public QualificationService(
        QualificationRepository qualificationRepository
    ) {
        this.qualificationRepository = qualificationRepository;
    }

    public Qualification addQualification(
        @Valid QualificationDto qualification
    ) {
        if (this.qualificationRepository.existsByName(qualification.name())) {
            throw new AlreadyExistingException("name", qualification.name());
        }

        return this.qualificationRepository.save(
            Qualification.fromDto(qualification)
        );
    }

    public void removeQualification(UUID qualificationId) {
        this.qualificationRepository.deleteById(qualificationId);
    }

    public Page<QualificationDto> getQualifications(Pageable pageable) {
        return this.qualificationRepository.findAll(pageable).map(
            Qualification::toDto
        );
    }

    public Optional<Qualification> getQualification(UUID qualificationId) {
        return this.qualificationRepository.findById(qualificationId);
    }

    public Qualification updateQualification(
        UpdateQualificationDto qualification
    ) {
        if (!this.qualificationRepository.existsById(qualification.id())) {
            throw new NotExistingException("qualification id is not existing!");
        }

        Optional<Qualification> optional =
            this.qualificationRepository.findByName(qualification.name());
        if (
            optional.isPresent() &&
            !optional.get().getId().equals(qualification.id())
        ) {
            throw new AlreadyExistingException("name", qualification.name());
        }

        Qualification save = this.qualificationRepository.save(
            qualification.toQualification()
        );
        return save;
    }

    public Page<Qualification> getByName(String name, Pageable pageable) {
        return this.qualificationRepository.getQualificationsByName(
            name,
            pageable
        );
    }

    public Page<OptionData<String>> getQualificationOptions(
        String filter,
        Pageable pageable
    ) {
        return this.qualificationRepository.getQualificationOptions(
            filter,
            pageable
        );
    }
}
