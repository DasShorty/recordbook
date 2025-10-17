package de.dasshorty.recordbook.company;

import de.dasshorty.recordbook.exception.AlreadyExistingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    @Autowired
    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public CompanyDto createCompany(CompanyDto companyDto) throws AlreadyExistingException {

        boolean existsCompanyName = this.companyRepository.existsByCompanyName(companyDto.getCompanyName());

        if (existsCompanyName) {
            throw new AlreadyExistingException("companyName", companyDto.getCompanyName());
        }

        CompanyDto save = this.companyRepository.save(companyDto);
        this.companyRepository.analyse();
        return save;
    }

    public void deleteCompany(UUID companyId) {
        this.companyRepository.deleteById(companyId);
    }

    public List<CompanyDto> retrieveComputers(int limit, int offset) {
        return this.companyRepository.findCompanies(offset, limit);
    }

    public Optional<CompanyDto> retrieveComputerById(UUID id) {
        return this.companyRepository.findById(id);
    }

    public long count() {
        return this.companyRepository.getAnalyzedCount();
    }

}
