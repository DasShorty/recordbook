package de.dasshorty.recordbook.company;

import de.dasshorty.recordbook.company.dto.CompanyDto;
import de.dasshorty.recordbook.company.dto.CompanyNameResult;
import de.dasshorty.recordbook.http.handler.UserInputHandler;
import de.dasshorty.recordbook.http.result.OptionData;
import de.dasshorty.recordbook.http.result.QueryResult;
import de.dasshorty.recordbook.user.User;
import de.dasshorty.recordbook.user.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/companies")
public class CompanyController {

    private static final Logger log = LoggerFactory.getLogger(CompanyController.class);
    private final CompanyService companyService;
    private final UserService userService;

    @Value("${application.url}")
    private String applicationUrl;

    @Value("${query.limit}")
    private int defaultLimit;

    @Value("${query.offset}")
    private int defaultOffset;

    @Autowired
    public CompanyController(CompanyService companyService, UserService userService) {
        this.companyService = companyService;
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR')")
    public ResponseEntity<?> getCompanies(@RequestParam(name = "limit") Integer limit, @RequestParam(name = "offset") Integer offset) {

        int convertedLimit = UserInputHandler.validInteger(limit) ? limit : defaultLimit;
        int convertedOffset = UserInputHandler.validInteger(offset) ? offset : defaultOffset;

        List<CompanyDto> companyDtos = this.companyService.retrieveCompanies(convertedLimit, convertedOffset).stream().map(
                Company::toBody).toList();

        log.debug("Length of List " + companyDtos.size());

        return ResponseEntity.ok(new QueryResult<>(this.companyService.count(), convertedLimit, convertedOffset, companyDtos));

    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCompany(@PathVariable UUID id) {
        return ResponseEntity.of(this.companyService.retrieveCompanyById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'COMPANY')")
    public ResponseEntity<?> createCompany(@RequestBody @Valid CompanyDto company) {


        List<User> users = company.users().stream().map(rawUID -> {

            try {
                return UUID.fromString(rawUID);
            } catch (Exception e) {
                throw new IllegalArgumentException("one or more user IDs is not valid");
            }
        }).map(uuid -> this.userService.retrieveUserById(uuid).orElseThrow()).toList();

        Company serviceCompany = this.companyService.createCompany(new Company(company.companyName(), users));
        return ResponseEntity.created(URI.create(this.applicationUrl + "/companies/" + serviceCompany.getId().toString())).body(
                serviceCompany);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'COMPANY')")
    public ResponseEntity<?> deleteCompany(@PathVariable("id") String id) {
        this.companyService.deleteCompany(UUID.fromString(id));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/name/{name}/exists")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'COMPANY')")
    public ResponseEntity<?> existsCompanyName(
            @PathVariable("name") @Valid @NotBlank(message = "name should contain valid data") String name) {

        boolean existsCompanyName = this.companyService.existsCompanyName(name);

        if (existsCompanyName) {
            return ResponseEntity.ok().body(new CompanyNameResult(name, false));
        } else {
            return ResponseEntity.ok().body(new CompanyNameResult(name, true));
        }

    }

    @GetMapping("options")
    public ResponseEntity<?> getCompanyOptions(
            @RequestParam("limit") Integer limit,
            @RequestParam("offset") Integer offset,
            @RequestParam("name") String companyName) {

        int convertedLimit = UserInputHandler.validInteger(limit) ? limit : defaultLimit;
        int convertedOffset = UserInputHandler.validInteger(offset) ? offset : defaultOffset;

        Page<OptionData<String>> companyOptions = this.companyService.getCompanyOptions(companyName, convertedOffset, convertedLimit);
        return ResponseEntity.ok(new QueryResult<>(companyOptions.getTotalElements(), convertedLimit, convertedOffset, companyOptions.getContent()));
    }
}
