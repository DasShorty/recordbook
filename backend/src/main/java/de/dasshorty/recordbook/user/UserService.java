package de.dasshorty.recordbook.user;

import de.dasshorty.recordbook.user.httpbodies.PasswordUserBody;
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

    public UserDto createUser(PasswordUserBody passwordUserBody) {

        String encodedPassword = this.passwordEncoder.encode(passwordUserBody.password());

        UserDto user = new UserDto(
                passwordUserBody.forename(), passwordUserBody.surname(), passwordUserBody.email(), encodedPassword, passwordUserBody.authorities(),
                passwordUserBody.userType()
        );

        UserDto save = this.userRepository.save(user);
        this.userRepository.analyse();
        return save;
    }


    public void createFirstUser(PasswordUserBody body) {
        if (this.userRepository.count() != 0L) {
            return;
        }

        this.createUser(body);
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
