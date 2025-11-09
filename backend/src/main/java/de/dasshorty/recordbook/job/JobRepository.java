package de.dasshorty.recordbook.job;

import de.dasshorty.recordbook.http.result.OptionData;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobRepository extends JpaRepository<Job, UUID> {

    String TABLE_NAME = "jobs";

    @Modifying
    @Transactional
    @NativeQuery("ANALYZE " + TABLE_NAME)
    void analyze();

    @Transactional
    @NativeQuery("SELECT reltuples::bigint FROM pg_class WHERE relname = '" + TABLE_NAME + "'")
    long getAnalyzedCount();

    @NativeQuery("SELECT * FROM " + TABLE_NAME + " LIMIT ?1 OFFSET ?2")
    List<Job> getJobs(int limit, int offset);

    boolean existsByName(@NotBlank String name);

    Optional<Job> findByName(String name);

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @Query("SELECT new de.dasshorty.recordbook.http.result.OptionData(j.id, j.name) FROM Job j WHERE j.name LIKE concat('%', :name, '%')")
    Page<OptionData<String>> getJobOptions(@Param("name") String name, Pageable pageable);
}
