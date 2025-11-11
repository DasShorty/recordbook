package de.dasshorty.recordbook.company;

import de.dasshorty.recordbook.http.result.OptionData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {

    @Transactional(readOnly = true)
    @Query("SELECT new de.dasshorty.recordbook.http.result.OptionData(c.id, c.companyName) FROM Company c WHERE c.companyName LIKE concat('%', :companyName, '%') ")
    Page<OptionData<String>> getCompaniesAsOptions(@Param("companyName") String companyName, Pageable pageable);

    @Transactional(readOnly = true)
    boolean existsByCompanyName(String companyName);
}
