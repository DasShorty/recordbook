package de.dasshorty.recordbook.user;

import de.dasshorty.recordbook.user.httpbodies.CreateUserBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDto createUser(UserDto userDto) {

        String encodedPassword = this.passwordEncoder.encode(userDto.getPassword());

        userDto.setPassword(encodedPassword);

        UserDto save = this.userRepository.save(userDto);
        this.userRepository.analyse();
        return save;
    }


    public void createFirstUser(UserDto userDto) {
        if (this.userRepository.count() != 0L) {
            return;
        }

        this.createUser(userDto);
    }

    public void deleteUser(UUID id) {
        this.userRepository.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserDto> optional = this.retrieveUserByEmail(username);

        if (optional.isEmpty()) {
            throw new UsernameNotFoundException(username);
        }

        return optional.get();
    }

    public Optional<UserDto> retrieveUserByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }

    public Optional<UserDto> retrieveUserById(UUID id) {
        return this.userRepository.findById(id);
    }

    public List<UserDto> retrieveUsers(int limit, int offset) {
        return this.userRepository.findUsers(offset, limit);
    }

    public List<UserDto> retrieveUsersByCompany(UUID companyId, int limit, int offset) {
        return this.userRepository.findUsersByCompany(companyId, limit, offset);
    }

    public long getUserCountByCompany(UUID companyId) {
        return this.userRepository.countByAssignedCompany_Id(companyId);
    }

    public long count() {
        return this.userRepository.getAnalyzedRowCount();
    }
}
