package de.dasshorty.recordbook.user.converter;

import de.dasshorty.recordbook.user.User;
import de.dasshorty.recordbook.user.UserRepository;
import de.dasshorty.recordbook.user.exceptions.UserIdConversionFailedException;
import de.dasshorty.recordbook.user.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UserConverter implements Converter<String, User> {

    private final UserRepository userRepository;

    @Autowired
    public UserConverter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User convert(String source) {
        if (source == null || source.isBlank()) {
            throw new UserIdConversionFailedException("User ID cannot be null or blank!");
        }

        UUID id;

        try {
            id = UUID.fromString(source);
        } catch (IllegalArgumentException ex) {
            throw new UserIdConversionFailedException("User ID '" + source + "' is not a valid UUID!");
        }

        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found!"));
    }
}
