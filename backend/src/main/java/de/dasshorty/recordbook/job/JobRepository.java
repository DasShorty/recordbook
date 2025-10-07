package de.dasshorty.recordbook.job;

import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobRepository extends JpaRepository<JobDto, UUID> {

    String TABLE_NAME = "jobs";

    @Modifying
    @Transactional
    @Query(nativeQuery = true, value = "ANALYZE " + TABLE_NAME)
    void analyze();

    @Transactional
    @Query(nativeQuery = true, value = "SELECT reltuples::bigint FROM pg_class WHERE relname = '" + TABLE_NAME + "'")
    long getAnalyzedCount();

    @Query(nativeQuery = true, value = "SELECT * FROM " + TABLE_NAME + " LIMIT ?1 OFFSET ?2")
    List<JobDto> getJobs(int limit, int offset);

    boolean existsByName(@NotBlank String name);

}
