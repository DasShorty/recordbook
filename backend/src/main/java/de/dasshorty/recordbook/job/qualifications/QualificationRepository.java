package de.dasshorty.recordbook.job.qualifications;

import de.dasshorty.recordbook.job.qualifications.dto.QualificationOptionDto;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface QualificationRepository extends JpaRepository<Qualification, UUID> {

    String TABLE_NAME = "qualifications";

    @Modifying
    @Transactional
    @Query(nativeQuery = true, value = "ANALYZE " + TABLE_NAME)
    void analyze();

    @Transactional
    @Query(nativeQuery = true, value = "SELECT reltuples::bigint FROM pg_class WHERE relname = '" + TABLE_NAME + "'")
    long getAnalyzedCount();

    @Query(nativeQuery = true, value = "SELECT * FROM " + TABLE_NAME + " LIMIT ?1 OFFSET ?2")
    List<Qualification> getQualifications(int limit, int offset);

    Optional<Qualification> findByName(String name);

    boolean existsByName(String name);

    @Query("SELECT Qualification FROM Qualification q WHERE q.name LIKE CONCAT('%', :name,'%')")
    Page<Qualification> getQualificationsByName(String name, Pageable pageable);

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @Query("SELECT new de.dasshorty.recordbook.job.qualifications.dto.QualificationOptionDto(q.id,q.name) FROM " +
            "Qualification q WHERE LOWER(q.name) LIKE LOWER(concat('%', :name, '%'))")
    Page<QualificationOptionDto> getQualificationOptions(@Param("name") String name, Pageable pageable);
}
