package de.dasshorty.recordbook.job.qualifications;

import de.dasshorty.recordbook.job.qualifications.dto.QualificationDto;
import de.dasshorty.recordbook.job.qualifications.dto.UpdateQualificationDto;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/jobs/qualifications")
public class QualificationController {

    private final QualificationService qualificationService;

    @Value("${query.limit}")
    private int defaultLimit;

    @Value("${query.offset}")
    private int defaultOffset;

    @Autowired
    public QualificationController(QualificationService qualificationService) {
        this.qualificationService = qualificationService;
    }

    @GetMapping
    public ResponseEntity<Page<QualificationDto>> getQualifications(
        @PageableDefault Pageable pageable,
        @RequestParam("search") String searchTerm
    ) {
        return ResponseEntity.ok(
            this.qualificationService.getQualifications(pageable)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQualification(@PathVariable("id") String id) {
        return ResponseEntity.of(
            this.qualificationService.getQualification(UUID.fromString(id))
        );
    }

    @PostMapping
    public ResponseEntity<?> createQualification(
        @RequestBody @Valid QualificationDto qualification
    ) {
        return ResponseEntity.ok(
            this.qualificationService.addQualification(qualification)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQualification(
        @PathVariable("id") String id
    ) {
        this.qualificationService.removeQualification(UUID.fromString(id));
        return ResponseEntity.ok().build();
    }

    @PutMapping
    public ResponseEntity<?> updateQualification(
        @RequestBody @Valid UpdateQualificationDto qualificationDto
    ) {
        return ResponseEntity.ok(
            this.qualificationService.updateQualification(qualificationDto)
        );
    }
}
