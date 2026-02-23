package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.book.dto.BookDto;
import de.dasshorty.recordbook.book.dto.CreateBookDto;
import de.dasshorty.recordbook.book.dto.UpdateTrainerDto;
import de.dasshorty.recordbook.exception.MissingTokenException;
import de.dasshorty.recordbook.exception.NotExistingException;
import de.dasshorty.recordbook.http.result.ErrorResult;
import de.dasshorty.recordbook.pdf.PdfManager;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'TRAINER')")
    public ResponseEntity<?> getBooks(@PageableDefault Pageable pageable) {
        return ResponseEntity.ok(this.bookService.getBooks(pageable));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'TRAINEE')")
    public ResponseEntity<?> getOwnBook(@CookieValue("access_token") String accessToken) {
        try {
            Optional<BookDto> book = this.bookService.getOwnBookByAccessToken(accessToken);
            return ResponseEntity.of(book);
        } catch (MissingTokenException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResult("not found", "access_token"));
        }
    }

    @GetMapping("/{bookId}")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'TRAINEE', 'TRAINER')")
    public ResponseEntity<BookDto> getBookById(@PathVariable @NotNull UUID bookId) {
        return ResponseEntity.of(this.bookService.getBookById(bookId));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR')")
    public ResponseEntity<BookDto> createBook(@RequestBody @Valid CreateBookDto bookBody) {
        BookDto createdBook = this.bookService.createBookFromDto(bookBody);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBook);
    }

    @PutMapping("/{bookId}/trainer")
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    public ResponseEntity<BookDto> updateBookTrainer(@PathVariable @NotNull UUID bookId,
                                                     @RequestBody @Valid UpdateTrainerDto updateTrainerDto) {
        return ResponseEntity.of(this.bookService.updateBookTrainer(bookId, updateTrainerDto.trainer()));
    }

    @GetMapping("/{bookId}/export")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<byte[]> exportBookAsPdf(
            @PathVariable @NotNull UUID bookId
    )throws IOException {
        var book = this.bookService.getBookEntityById(bookId).orElseThrow(() -> new NotExistingException("Das Buch mit der ID " + bookId + " existiert nicht."));
        ByteArrayOutputStream pdf = PdfManager.createPdf(book);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf.toByteArray());
    }

}
