package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.book.dto.BookDto;
import de.dasshorty.recordbook.book.dto.CreateBookCommand;
import de.dasshorty.recordbook.book.dto.UpdateTrainerCommand;
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
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'TRAINEE', 'TRAINER')")
    public ResponseEntity<BookDto> getOwnBook(@CookieValue("access_token") String accessToken) {
        return ResponseEntity.of(this.bookService.getOwnBookByAccessToken(accessToken));
    }

    @GetMapping("/{bookId}")
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR', 'TRAINEE', 'TRAINER')")
    public ResponseEntity<BookDto> getBookById(@PathVariable("bookId") @NotNull Book book) {
        return ResponseEntity.of(Optional.of(book.toDto()));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMINISTRATOR')")
    public ResponseEntity<BookDto> createBook(@RequestBody @Valid CreateBookCommand bookBody) {
        BookDto createdBook = this.bookService.createBookFromDto(bookBody);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBook);
    }

    @PutMapping("/{bookId}/trainer")
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    public ResponseEntity<BookDto> updateBookTrainer(@PathVariable("bookId") @NotNull Book book,
                                                     @RequestBody @Valid UpdateTrainerCommand updateTrainerDto) {
        return ResponseEntity.of(this.bookService.updateBookTrainer(book, updateTrainerDto.trainer()));
    }

    @GetMapping("/{bookId}/export")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<byte[]> exportBookAsPdf(
            @PathVariable("bookId") @NotNull Book book
    ) throws IOException {
        ByteArrayOutputStream pdf = PdfManager.createPdf(book);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf.toByteArray());
    }

}
