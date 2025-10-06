package de.dasshorty.recordbook.book.job.qualifications;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface QualificationRepository extends JpaRepository<QualificationDto, UUID> {
}
