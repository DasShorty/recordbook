package de.dasshorty.recordbook.user;

import de.dasshorty.recordbook.query.QueryResult;
import de.dasshorty.recordbook.user.httpbodies.SimpleUserBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;

        initFirstUser();
    }

    private void initFirstUser() {
        this.userService.createFirstUser(new SimpleUserBody("Anthony", "Timmel", "anthony@eno-intern.de", "test", UserType.COMPANY, List.of(Authority.COMPANY)));
    }

    @PostMapping
    public ResponseEntity<UserDto> create(@RequestBody SimpleUserBody body) {
        return null;
    }

    @GetMapping
    public ResponseEntity<QueryResult<UserDto>> getUsers(@RequestParam(value = "offset") Integer offset,
                                                         @RequestParam(value = "limit") Integer limit) {


        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<QueryResult<UserDto>> getUser(@PathVariable String id) {

        return null;

    }
}
