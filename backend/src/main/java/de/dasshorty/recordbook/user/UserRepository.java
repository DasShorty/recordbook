package de.dasshorty.recordbook.user;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends CrudRepository<UserDto, UUID> {

    Optional<UserDto> findByEmail(String email);

    @Query(nativeQuery = true, value = "SELECT * FROM users OFFSET ?1 LIMIT ?2")
    List<UserDto> findUsers(int offset, int limit);

    @Query(nativeQuery = true, value = "SELECT * FROM users WHERE assigned_company_id == ?1 OFFSET ?2 LIMIT ?3")
    List<UserDto> findUsersByCompany(UUID companyId, int offset, int limit);

    long countByAssignedCompany_Id(UUID companyId);

    @Query(nativeQuery = true, value = "SELECT pg_class.reltuples::bigint FROM pg_class WHERE relname = 'users'")
    long getAnalyzedRowCount();

    @Transactional
    @Modifying
    @Query(nativeQuery = true, value = "ANALYSE users")
    void analyse();
}
