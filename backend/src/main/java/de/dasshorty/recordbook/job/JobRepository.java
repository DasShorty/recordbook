package de.dasshorty.recordbook.job;

import de.dasshorty.recordbook.http.result.OptionData;
import jakarta.validation.constraints.NotBlank;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface JobRepository extends JpaRepository<Job, UUID> {
    boolean existsByName(@NotBlank String name);

    Optional<Job> findByName(String name);

    @Transactional(readOnly = true)
    @Query(
        "SELECT new de.dasshorty.recordbook.http.result.OptionData(j.id, j.name) FROM Job j WHERE j.name LIKE concat('%', :name, '%')"
    )
    Page<OptionData<String>> getJobOptions(
        @Param("name") String name,
        Pageable pageable
    );
}
