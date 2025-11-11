package de.dasshorty.recordbook.company;

import de.dasshorty.recordbook.company.dto.CompanyDto;
import de.dasshorty.recordbook.company.dto.CompanyNameResult;
import de.dasshorty.recordbook.company.dto.CreateCompanyDto;
import de.dasshorty.recordbook.http.result.OptionData;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR')")
    public ResponseEntity<Page<CompanyDto>> getCompanies(@PageableDefault Pageable pageable) {
        return ResponseEntity.ok(this.companyService.getAllCompanies(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyDto> getCompany(@PathVariable @NotNull UUID id) {
        return ResponseEntity.of(this.companyService.retrieveCompanyById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'COMPANY')")
    public ResponseEntity<CompanyDto> createCompany(@RequestBody @Valid CreateCompanyDto company) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.companyService.createCompany(company));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'COMPANY')")
    public ResponseEntity<Void> deleteCompany(@PathVariable UUID id) {
        this.companyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/name/{name}/exists")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'COMPANY')")
    public ResponseEntity<CompanyNameResult> existsCompanyName(
            @PathVariable @Valid @NotBlank(message = "name should contain valid data") String name) {

        boolean exists = this.companyService.existsCompanyName(name);
        return ResponseEntity.ok(new CompanyNameResult(name, !exists));
    }

    @GetMapping("/options")
    public ResponseEntity<Page<OptionData<String>>> getCompanyOptions(
            @PageableDefault Pageable pageable,
            @RequestParam("name") String companyName) {
        return ResponseEntity.ok(this.companyService.getCompanyOptions(companyName, pageable));
    }
}
