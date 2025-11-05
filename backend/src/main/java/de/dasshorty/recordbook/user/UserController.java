package de.dasshorty.recordbook.user;

import de.dasshorty.recordbook.http.handler.UserInputHandler;
import de.dasshorty.recordbook.http.result.ErrorResult;
import de.dasshorty.recordbook.http.result.QueryResult;
import de.dasshorty.recordbook.user.httpbodies.AdvancedUserDto;
import de.dasshorty.recordbook.user.httpbodies.CreateUserDto;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @Value("${query.limit}")
    private int defaultLimit;

    @Value("${query.offset}")
    private int defaultOffset;

    @Value("${administrator.user.email}")
    private String administratorUserEmail;

    @Value("${administrator.user.forename}")
    private String administratorUserForename;

    @Value("${administrator.user.surname}")
    private String administratorUserSurname;

    @Value("${administrator.password}")
    private String administratorUserPassword;

    @Value("${application.url}")
    private String applicationUrl;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostConstruct
    private void initFirstUser() {
        this.userService.createFirstUser(new User(
                administratorUserForename, administratorUserSurname, administratorUserEmail, administratorUserPassword,
                List.of(Authority.ADMINISTRATOR), UserType.COMPANY
        ));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('COMPANY', 'ADMINISTRATOR')")
    public ResponseEntity<?> create(@RequestBody @Valid CreateUserDto body) {
        AdvancedUserDto advancedUserDto = this.userService.createUser(body.toNewUserWithRandomPassword()).transformToBody();
        return ResponseEntity.created(URI.create(applicationUrl + "/users/" + advancedUserDto.id().toString())).body(advancedUserDto);
    }

    @GetMapping
    public ResponseEntity<?> getUsers(@RequestParam(value = "offset") Integer offset, @RequestParam(value = "limit") Integer limit,
                                      @RequestParam(value = "company", required = false) String companyId,
                                      @RequestParam(value = "userType", required = false) UserType userType) {

        int convertedOffset = UserInputHandler.validInteger(offset) ? offset : this.defaultOffset;
        int convertedLimit = UserInputHandler.validInteger(limit) ? limit : this.defaultLimit;

        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().anyMatch(
                a -> a.getAuthority().equals("ADMINISTRATOR"));

        List<AdvancedUserDto> users;
        long totalCount;

        if (isAdmin && companyId == null) {
            users = this.userService.retrieveUsers(convertedLimit, convertedOffset).stream().map(User::transformToBody).toList();
            totalCount = this.userService.count();
        } else {
            if (companyId == null) {
                return ResponseEntity.badRequest().body(new ErrorResult("companyId is required for non-admins", "companyId"));
            }
            UUID companyUid;
            try {
                companyUid = UUID.fromString(companyId);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(new ErrorResult("companyId isn't a valid id", "companyId"));
            }

            if (userType != null) {
                return ResponseEntity.ok(this.userService.getUsersByCompanyAndUserType(companyUid, userType, convertedLimit, convertedOffset));
            }

            users = this.userService.retrieveUsersByCompany(companyUid, convertedLimit, convertedOffset).stream().map(User::transformToBody)
                    .toList();
            totalCount = this.userService.getUserCountByCompany(companyUid);
        }

        return ResponseEntity.ok(new QueryResult<>(totalCount, convertedOffset, convertedLimit, users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable String id) {

        if (id.isBlank()) {
            return ResponseEntity.badRequest().body(new ErrorResult("Id is required", "id"));
        }

        UUID uid;

        try {
            uid = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResult("Id is not a valid id", "id"));
        }

        return ResponseEntity.of(this.userService.retrieveUserById(uid));

    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'COMPANY')")
    public ResponseEntity<?> delete(@PathVariable("id") String id) {

        if (id.isBlank()) {
            return ResponseEntity.badRequest().body(new ErrorResult("Id is required", "id"));
        }

        UUID uid;

        try {
            uid = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResult("Id is not a valid id", "id"));
        }

        boolean isAdministrator = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().anyMatch(
                a -> a.getAuthority().equals(Authority.ADMINISTRATOR.name()));

        Optional<User> optional = this.userService.retrieveUserById(uid);

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResult("User not found", "id"));
        }

        User user = optional.get();

        if (user.isAdministrator() && !isAdministrator) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResult("Administrator can't be deleted", "userId"));
        }

        this.userService.deleteUser(uid);

        return ResponseEntity.ok().build();
    }
}
