package de.dasshorty.recordbook.company;

import de.dasshorty.recordbook.company.dto.CompanyOptionDto;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @Query("SELECT new de.dasshorty.recordbook.company.dto.CompanyOptionDto(c.id, c.companyName) FROM Company c WHERE c.companyName LIKE concat('%', :companyName, '%') ")
    Page<CompanyOptionDto> getCompaniesAsOptions(@Param("companyName") String companyName, Pageable pageable);

    @Query(nativeQuery = true, value = "SELECT * FROM companies OFFSET ?1 LIMIT ?2")
    List<Company> findCompanies(int offset, int limit);

    @Transactional
    @Modifying
    @NativeQuery("ANALYSE companies")
    void analyse();

    @Transactional
    @NativeQuery("SELECT reltuples::bigint FROM pg_class WHERE relname = 'companies'")
    long getAnalyzedCount();

    boolean existsByCompanyName(String companyName);
}
