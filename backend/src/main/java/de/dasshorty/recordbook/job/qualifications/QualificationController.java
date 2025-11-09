package de.dasshorty.recordbook.job.qualifications;

import de.dasshorty.recordbook.http.handler.UserInputHandler;
import de.dasshorty.recordbook.http.result.OptionData;
import de.dasshorty.recordbook.http.result.QueryResult;
import de.dasshorty.recordbook.job.qualifications.dto.UpdateQualificationDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
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
    public ResponseEntity<?> getQualifications(
            @RequestParam("limit") Integer limit,
            @RequestParam("offset") Integer offset,
            @RequestParam(value = "search", required = false) String searchTerm) {

        int convertedLimit = UserInputHandler.validInteger(limit) ? limit : defaultLimit;
        int convertedOffset = UserInputHandler.validInteger(offset) ? offset : defaultOffset;

        if (searchTerm != null) {

            Page<Qualification> page = this.qualificationService.getByName(searchTerm, convertedLimit, convertedOffset);

            return ResponseEntity.ok(new QueryResult<>(
                    page.getTotalElements(),
                    convertedLimit,
                    convertedOffset,
                    page.get().toList()));
        }

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

    @GetMapping("/options")
    public ResponseEntity<?> getQualificationOptions(@RequestParam("offset") Integer offset,
                                                     @RequestParam("limit") Integer limit,
                                                     @RequestParam(value = "filter", required = false) String filter) {

        int convertedLimit = UserInputHandler.validInteger(limit) ? limit : defaultLimit;
        int convertedOffset = UserInputHandler.validInteger(offset) ? offset : defaultOffset;

        Page<OptionData<String>> qualificationOptions = this.qualificationService.getQualificationOptions(filter == null ? "" : filter, convertedLimit,
                convertedOffset);

        return ResponseEntity.ok(new QueryResult<>(
                qualificationOptions.getTotalElements(),
                convertedLimit,
                convertedOffset,
                qualificationOptions.stream().toList()
        ));
    }

}
