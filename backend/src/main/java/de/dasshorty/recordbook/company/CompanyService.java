package de.dasshorty.recordbook.company;

import de.dasshorty.recordbook.exception.AlreadyExistingException;
import de.dasshorty.recordbook.http.result.OptionData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public Company createCompany(Company company) throws AlreadyExistingException {

        boolean existsCompanyName = this.existsCompanyName(company.getCompanyName());

        if (existsCompanyName) {
            throw new AlreadyExistingException("companyName", company.getCompanyName());
        }

        Company save = this.companyRepository.save(company);
        this.companyRepository.analyse();
        return save;
    }

    public boolean existsCompanyName(String companyName) {
        return this.companyRepository.existsByCompanyName(companyName);
    }

    public void deleteCompany(UUID companyId) {
        this.companyRepository.deleteById(companyId);
    }

    public List<Company> retrieveCompanies(int limit, int offset) {
        return this.companyRepository.findCompanies(offset, limit);
    }

    public Optional<Company> retrieveCompanyById(UUID id) {
        return this.companyRepository.findById(id);
    }

    public long count() {
        return this.companyRepository.getAnalyzedCount();
    }

    protected Page<OptionData<String>> getCompanyOptions(String companyName, int offset, int limit) {
        return this.companyRepository.getCompaniesAsOptions(companyName, Pageable.ofSize(limit).withPage(offset / limit));
    }

}
