package de.dasshorty.recordbook.job.qualifications;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
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

    @Query(nativeQuery = true, value = "SELECT * FROM " + TABLE_NAME + " WHERE name ILIKE concat('%', ?1, '%') LIMIT ?2 OFFSET ?3")
    List<Qualification> getQualificationsByName(String name, int limit, int offset);

    boolean existsByName(String name);

    @Query(nativeQuery = true, value = "SELECT count() FROM " + TABLE_NAME + " WHERE name ILIKE concat('%', ?1, '%')")
    int countByName(String name);
}
