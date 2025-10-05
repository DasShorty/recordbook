package de.dasshorty.recordbook.user;

import de.dasshorty.recordbook.query.QueryResult;
import de.dasshorty.recordbook.user.httpbodies.SimpleUserBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserDto> create(@RequestBody SimpleUserBody body) {
        return null;
    }

    @GetMapping
    public ResponseEntity<QueryResult<UserDto>> getUsers(@RequestParam(value = "offset", required = true) Integer offset,
                                                         @RequestParam(value = "limit", required = true) Integer limit) {


        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<QueryResult<UserDto>> getUser(@PathVariable String id) {

        return null;

    }
}
