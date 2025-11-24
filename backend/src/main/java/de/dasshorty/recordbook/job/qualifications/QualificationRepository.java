package de.dasshorty.recordbook.job.qualifications;

import de.dasshorty.recordbook.http.result.OptionData;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QualificationRepository
    extends JpaRepository<Qualification, UUID> {
    Optional<Qualification> findByName(String name);

    boolean existsByName(String name);

    @Query(
        "SELECT Qualification FROM Qualification q WHERE q.name LIKE CONCAT('%', :name,'%')"
    )
    Page<Qualification> getQualificationsByName(String name, Pageable pageable);

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @Query(
        "SELECT new de.dasshorty.recordbook.http.result.OptionData(q.id,q.name) FROM " +
            "Qualification q WHERE LOWER(q.name) LIKE LOWER(concat('%', :name, '%'))"
    )
    Page<OptionData<String>> getQualificationOptions(
        @Param("name") String name,
        Pageable pageable
    );
}
