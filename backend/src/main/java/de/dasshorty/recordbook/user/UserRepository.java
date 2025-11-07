package de.dasshorty.recordbook.user;

import de.dasshorty.recordbook.user.dto.UserDto;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends CrudRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    @NativeQuery("SELECT * FROM users OFFSET ?1 LIMIT ?2")
    List<User> findUsers(int offset, int limit);

    @NativeQuery("SELECT * FROM users WHERE assigned_company_id == ?1 OFFSET ?2 LIMIT ?3")
    List<User> findUsersByCompany(UUID companyId, int offset, int limit);

    @NativeQuery("SELECT count(id) FROM users WHERE assigned_company_id = ?1")
    long countByAssignedCompany_Id(UUID companyId);

    @NativeQuery("SELECT pg_class.reltuples::bigint FROM pg_class WHERE relname = 'users'")
    long getAnalyzedRowCount();

    @Transactional
    @Modifying
    @NativeQuery("ANALYSE users")
    void analyse();

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @Query("SELECT new de.dasshorty.recordbook.user.dto.UserDto(u.id, u.forename, u.surname, u.userType) from User u " +
            "WHERE u.userType = :userType AND u.assignedCompany.id = :companyId")
    Page<List<UserDto>> getUserOptions(@Param("companyId") UUID companyId, @Param("userType") UserType userType,
                                       Pageable pageable);

    boolean existsUserByAssignedCompany_IdAndId(UUID assignedCompanyId, UUID id);

    @Query("SELECT u.assignedCompany.id FROM User u WHERE u.id = :userId")
    UUID getCompanyByUserId(UUID userId);
}
