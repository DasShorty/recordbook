package de.dasshorty.recordbook.company;

import de.dasshorty.recordbook.company.dto.CompanyDto;
import de.dasshorty.recordbook.company.dto.CreateCompanyDto;
import de.dasshorty.recordbook.exception.AlreadyExistingException;
import de.dasshorty.recordbook.http.result.OptionData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Transactional(readOnly = true)
    public Page<CompanyDto> getAllCompanies(Pageable pageable) {
        return this.companyRepository.findAll(pageable).map(Company::toDto);
    }

    @Transactional
    public CompanyDto createCompany(CreateCompanyDto dto) {
        if (this.existsCompanyName(dto.companyName())) {
            throw new AlreadyExistingException("companyName", dto.companyName());
        }

        return this.companyRepository.save(Company.fromDto(dto)).toDto();
    }

    @Transactional(readOnly = true)
    public boolean existsCompanyName(String companyName) {
        return this.companyRepository.existsByCompanyName(companyName);
    }

    @Transactional
    public void deleteCompany(UUID companyId) {
        this.companyRepository.deleteById(companyId);
    }

    @Transactional(readOnly = true)
    public Optional<CompanyDto> retrieveCompanyById(UUID id) {
        return this.companyRepository.findById(id).map(Company::toDto);
    }

    @Transactional(readOnly = true)
    protected Page<OptionData<String>> getCompanyOptions(String companyName, Pageable pageable) {
        return this.companyRepository.getCompaniesAsOptions(companyName, pageable);
    }

}
