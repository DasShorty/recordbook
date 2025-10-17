package de.dasshorty.recordbook.company;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<CompanyDto, UUID> {

    @Query(nativeQuery = true, value = "SELECT * FROM companies OFFSET ?1 LIMIT ?2")
    List<CompanyDto> findCompanies(int offset, int limit);

    @Transactional
    @Modifying
    @Query(nativeQuery = true, value = "ANALYSE companies")
    void analyse();

    @Transactional
    @Query(nativeQuery = true, value = "SELECT reltuples::bigint FROM pg_class WHERE relname = 'companies'")
    long getAnalyzedCount();

    boolean existsByCompanyName(String companyName);

}
