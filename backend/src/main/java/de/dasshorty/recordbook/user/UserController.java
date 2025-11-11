package de.dasshorty.recordbook.user;

import de.dasshorty.recordbook.user.dto.CreateUserDto;
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

import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('COMPANY', 'ADMINISTRATOR')")
    public ResponseEntity<UserDto> create(@RequestBody @Valid CreateUserDto body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.createUser(body)); // TODO - check for possible issues
    }

    @GetMapping
    public ResponseEntity<Page<UserDto>> getUsers(
            @PageableDefault Pageable pageable,
            @RequestParam(value = "userType", required = false) UserType userType) {
        return ResponseEntity.ok(this.userService.retrieveUsers(pageable, userType));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable @NotNull UUID id) {
        return ResponseEntity.of(this.userService.retrieveUserById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'COMPANY')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        this.userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
