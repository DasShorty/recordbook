package de.dasshorty.recordbook.user;

import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface UserRepository extends CrudRepository<UserDto, UUID> {
}
