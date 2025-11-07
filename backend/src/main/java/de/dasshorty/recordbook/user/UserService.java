package de.dasshorty.recordbook.user;

import de.dasshorty.recordbook.http.result.OptionResult;
import de.dasshorty.recordbook.user.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public User createUser(User user) {

        String encodedPassword = this.passwordEncoder.encode(user.getPassword());

        user.setPassword(encodedPassword);

        User save = this.userRepository.save(user);
        this.userRepository.analyse();
        return save;
    }

    public void createFirstUser(User user) {
        if (this.userRepository.count() != 0L) {
            return;
        }

        this.createUser(user);
    }

    public void deleteUser(UUID id) {
        this.userRepository.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> optional = this.retrieveUserByEmail(username);

        if (optional.isEmpty()) {
            throw new UsernameNotFoundException(username);
        }

        return optional.get();
    }

    public Optional<User> retrieveUserByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }

    public Optional<User> retrieveUserById(UUID id) {
        return this.userRepository.findById(id);
    }

    public List<User> retrieveUsers(int limit, int offset) {
        return this.userRepository.findUsers(offset, limit);
    }

    public List<User> retrieveUsersByCompany(UUID companyId, int limit, int offset) {
        return this.userRepository.findUsersByCompany(companyId, limit, offset);
    }

    public long getUserCountByCompany(UUID companyId) {
        return this.userRepository.countByAssignedCompany_Id(companyId);
    }

    public long count() {
        return this.userRepository.getAnalyzedRowCount();
    }

    public Page<List<UserDto>> getUsersByCompanyAndUserType(UUID companyId, UserType userType, int limit, int offset) {
        return this.userRepository.getUserOptions(companyId, userType, Pageable.ofSize(limit).withPage(offset / limit));
    }
}
