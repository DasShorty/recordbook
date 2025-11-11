package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.authentication.jwt.JwtHandler;
import de.dasshorty.recordbook.book.dto.BookDto;
import de.dasshorty.recordbook.book.dto.CreateBookDto;
import de.dasshorty.recordbook.http.result.ErrorResult;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;
    private final JwtHandler jwtHandler;


    public BookController(BookService bookService, JwtHandler jwtHandler) {
        this.bookService = bookService;
        this.jwtHandler = jwtHandler;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'TRAINER')")
    public ResponseEntity<?> getAssignedTraineeBooks(
            @CookieValue("access_token") String accessToken,
            @PageableDefault Pageable pageable) {

        Optional<UUID> optional = this.jwtHandler.extractUserId(accessToken);

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResult("not found", "access_token"));
        }

        UUID userId = optional.get();

        return ResponseEntity.ok(this.bookService.getBooksByTrainerForAuthorizedUser(
                userId, pageable));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'TRAINEE')")
    public ResponseEntity<?> getOwnBook(@CookieValue("access_token") String accessToken) {

        Optional<UUID> optional = this.jwtHandler.extractUserId(accessToken);

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResult("not found", "access_token"));
        }

        UUID userId = optional.get();
        Optional<BookDto> book = this.bookService.getBookByTraineeId(userId);

        return ResponseEntity.of(book);
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<BookDto> getBookById(@PathVariable @NotNull UUID bookId) {
        return ResponseEntity.of(this.bookService.getBookById(bookId));
    }

    @PostMapping
    public ResponseEntity<BookDto> createBook(@RequestBody @Valid CreateBookDto bookBody) {
        BookDto createdBook = this.bookService.createBookFromDto(bookBody);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBook);
    }

}
