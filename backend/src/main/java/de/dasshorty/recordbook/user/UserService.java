package de.dasshorty.recordbook.user;

import de.dasshorty.recordbook.company.CompanyDto;
import de.dasshorty.recordbook.user.httpbodies.SimpleUserBody;
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

    public UserDto createUser(SimpleUserBody simpleUserBody) {

        String encodedPassword = this.passwordEncoder.encode(simpleUserBody.password());

        UserDto user = new UserDto(
                simpleUserBody.forename(),
                simpleUserBody.surname(),
                simpleUserBody.email(),
                encodedPassword,
                simpleUserBody.authorities(),
                simpleUserBody.userType()
        );

        UserDto save = this.userRepository.save(user);
        this.userRepository.analyse();
        return save;
    }


    public void createFirstUser(SimpleUserBody body) {
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
        return this.userRepository.retrieveUsers(limit, offset);
    }

    public List<UserDto> retrieveUsersByCompany(UUID companyId, int limit, int offset) {
        return this.userRepository.retrieveUsersByCompany(companyId, limit, offset);
    }

    public long getUserCountByCompany(UUID companyId) {
        return this.userRepository.countByAssignedCompany_Id(companyId);
    }

    public long count() {
        return this.userRepository.getAnalyzedRowCount();
    }
}
