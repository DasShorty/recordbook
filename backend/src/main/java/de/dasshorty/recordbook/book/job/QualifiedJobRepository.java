package de.dasshorty.recordbook.book.job;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface QualifiedJobRepository extends JpaRepository<QualifiedJobDto, UUID> {
}
