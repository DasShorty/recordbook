package de.dasshorty.recordbook.job.qualifications;

import de.dasshorty.recordbook.http.handler.UserInputHandler;
import de.dasshorty.recordbook.http.result.QueryResult;
import de.dasshorty.recordbook.job.qualifications.dto.UpdateQualificationDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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
    public ResponseEntity<?> getQualifications(@RequestParam Integer limit, @RequestParam Integer offset) {

        int convertedLimit = UserInputHandler.validInteger(limit) ? limit : defaultLimit;
        int convertedOffset = UserInputHandler.validInteger(offset) ? offset : defaultOffset;

        List<Qualification> qualifications = this.qualificationService.getQualifications(convertedLimit, convertedOffset);

        return ResponseEntity.ok(new QueryResult<>(this.qualificationService.count(), convertedLimit, convertedOffset, qualifications));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQualification(@PathVariable("id") String id) {
        return ResponseEntity.of(this.qualificationService.getQualification(UUID.fromString(id)));
    }

    @PostMapping
    public ResponseEntity<?> createQualification(@RequestBody @Valid Qualification qualification) {
        return ResponseEntity.ok(this.qualificationService.addQualification(qualification));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQualification(@PathVariable("id") String id) {
        this.qualificationService.removeQualification(UUID.fromString(id));
        return ResponseEntity.ok().build();
    }

    @PutMapping
    public ResponseEntity<?> updateQualification(@RequestBody @Valid UpdateQualificationDto qualificationDto) {
        return ResponseEntity.ok(this.qualificationService.updateQualification(qualificationDto.toQualification()));
    }
}
