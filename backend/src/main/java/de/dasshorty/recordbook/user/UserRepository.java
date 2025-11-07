package de.dasshorty.recordbook.user;

import de.dasshorty.recordbook.user.dto.UserDto;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends CrudRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    @Query(nativeQuery = true, value = "SELECT * FROM users OFFSET ?1 LIMIT ?2")
    List<User> findUsers(int offset, int limit);

    @Query(nativeQuery = true, value = "SELECT * FROM users WHERE assigned_company_id == ?1 OFFSET ?2 LIMIT ?3")
    List<User> findUsersByCompany(UUID companyId, int offset, int limit);

    @Query(nativeQuery = true, value = "SELECT id,forename,surname,user_type FROM users WHERE assigned_company_id = ?1 AND user_type = ?2 OFFSET ?3 LIMIT ?4")
    List<UserDto> findAllByAssignedCompany_IdAndUserType(UUID companyId, UserType userType, int offset, int limit);

    @Query(nativeQuery = true, value = "SELECT count(id) FROM users WHERE assigned_company_id = ?1")
    long countByAssignedCompany_Id(UUID companyId);

    @Query(nativeQuery = true, value = "SELECT pg_class.reltuples::bigint FROM pg_class WHERE relname = 'users'")
    long getAnalyzedRowCount();

    @Transactional
    @Modifying
    @Query(nativeQuery = true, value = "ANALYSE users")
    void analyse();
}
