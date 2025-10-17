package de.dasshorty.recordbook.company;

import de.dasshorty.recordbook.http.handler.UserInputHandler;
import de.dasshorty.recordbook.http.result.QueryResult;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/companies")
public class CompanyController {

    private final CompanyService companyService;

    @Value("${query.limit}")
    private int defaultLimit;

    @Value("${query.offset}")
    private int defaultOffset;

    @Autowired
    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR')")
    public ResponseEntity<?> getCompanies(@RequestParam(name = "limit") Integer limit, @RequestParam(name = "offset") Integer offset) {

        int convertedLimit = UserInputHandler.validInteger(limit) ? limit : defaultLimit;
        int convertedOffset = UserInputHandler.validInteger(offset) ? offset : defaultOffset;

        List<CompanyDto> companyDtos = this.companyService.retrieveComputers(convertedLimit, convertedOffset);

        return ResponseEntity.ok(new QueryResult<>(
                this.companyService.count(), convertedLimit, convertedOffset, companyDtos
        ));

    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCompany(@PathVariable UUID id) {
        return ResponseEntity.of(this.companyService.retrieveComputerById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'COMPANY')")
    public ResponseEntity<?> createCompany(@RequestBody @Valid CompanyDto company) {
        return ResponseEntity.ok(this.companyService.createCompany(company));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'COMPANY')")
    public ResponseEntity<?> deleteCompany(@PathVariable("id") String id) {
        this.companyService.deleteCompany(UUID.fromString(id));
        return ResponseEntity.ok().build();
    }
}
