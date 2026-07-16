package de.dasshorty.recordbook.user;

import de.dasshorty.recordbook.exceptions.ForbiddenException;
import de.dasshorty.recordbook.mail.MailService;
import de.dasshorty.recordbook.user.dto.CreateUserCommand;
import de.dasshorty.recordbook.user.dto.UserDto;
import de.dasshorty.recordbook.user.exceptions.UserAlreadyExistingException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    @Value("${administrator.user.email}")
    private String administratorUserEmail;

    @Value("${administrator.user.forename}")
    private String administratorUserForename;

    @Value("${administrator.user.surname}")
    private String administratorUserSurname;

    @Value("${administrator.password}")
    private String administratorUserPassword;

    @Autowired
    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder, MailService mailService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
    }

    private static Specification<User> hasUserType(UserType userType) {
        return (
                (root, query, criteriaBuilder) ->
                        userType == null
                                ? null
                                : criteriaBuilder.equal(root.get("userType"), userType)
        );
    }

    @PostConstruct
    private void initFirstUser() {

        if (this.userRepository.count() != 0) {
            return;
        }

        CreateUserCommand createUserCommand = new CreateUserCommand(administratorUserForename, administratorUserSurname,
                administratorUserEmail, passwordEncoder.encode(administratorUserPassword), UserType.TRAINER);

        User user = User.fromDto(createUserCommand);
        user.setAuthority(Authority.ADMINISTRATOR);

        this.userRepository.save(user);
    }

    @Transactional
    public UserDto createUser(CreateUserCommand userDto) {
        if (this.userRepository.findByEmail(userDto.email()).isPresent()) {
            throw new UserAlreadyExistingException(
                    "User with email, already exists"
            );
        }

        var user = User.fromDto(userDto);
        var previousPassword = user.getPassword();
        user.setPassword(this.passwordEncoder.encode(user.getPassword()));
        UserDto dto = this.userRepository.save(user).toDto();

        this.mailService.sendNewUserMail(dto, previousPassword);

        return dto;
    }

    @Transactional
    public void deleteUser(User user) {

        var isAdministrator = Objects.requireNonNull(SecurityContextHolder.getContext()
                        .getAuthentication())
                .getAuthorities()
                .stream()
                .anyMatch(a ->
                        Objects.equals(a.getAuthority(), Authority.ADMINISTRATOR.name())
                );

        if (user.isAdministrator() && !isAdministrator) {
            throw new ForbiddenException(
                    "Only administrators can delete administrator accounts"
            );
        }

        this.userRepository.deleteById(user.getId());
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        var optional = this.retrieveUserByEmail(username);

        if (optional.isEmpty()) {
            throw new UsernameNotFoundException(username);
        }

        return optional.get();
    }

    public Optional<User> retrieveUserByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }

    // Internal method for service-to-service calls that need the entity
    public Optional<User> retrieveUserEntityById(UUID id) {
        return this.userRepository.findById(id);
    }

    public Page<UserDto> retrieveUsers(Pageable pageable, UserType userType) {
        var isAdmin = Objects.requireNonNull(SecurityContextHolder.getContext()
                        .getAuthentication())
                .getAuthorities()
                .stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), "ADMINISTRATOR"));

        if (userType == null && !isAdmin) {
            throw new ForbiddenException(
                    "Only administrators can retrieve all users"
            );
        }

        if (userType == null) {
            return this.userRepository.findAll(pageable).map(User::toDto);
        }

        return this.userRepository.findAll(
                UserService.hasUserType(userType),
                pageable
        ).map(User::toDto);
    }
}
