package de.dasshorty.recordbook.user;

import de.dasshorty.recordbook.user.dto.CreateUserCommand;
import de.dasshorty.recordbook.user.dto.UserDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('COMPANY', 'ADMINISTRATOR')")
    public ResponseEntity<UserDto> create(@RequestBody @Valid CreateUserCommand body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.createUser(body));
    }

    @GetMapping
    public ResponseEntity<Page<UserDto>> getUsers(
            @PageableDefault Pageable pageable,
            @RequestParam(value = "userType", required = false) UserType userType) {
        return ResponseEntity.ok(this.userService.retrieveUsers(pageable, userType));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable("id") @NotNull User user) {
        return ResponseEntity.ok(user.toDto());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'COMPANY')")
    public ResponseEntity<Void> delete(@PathVariable("id") @NotNull User user) {
        this.userService.deleteUser(user);
        return ResponseEntity.noContent().build();
    }
}
