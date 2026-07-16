package de.dasshorty.recordbook.book;

import de.dasshorty.recordbook.book.exceptions.BookIdConversionFailedException;
import de.dasshorty.recordbook.book.exceptions.BookNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class BookIdConverter implements Converter<String, Book> {

    private final BookRepository bookRepository;

    @Autowired
    public BookIdConverter(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public Book convert(String source) {

        UUID id;

        try {
            id = UUID.fromString(source);

        } catch (Exception e) {
            throw new BookIdConversionFailedException("Failed to convert book id: " + source);
        }


        return this.bookRepository.findById(id).orElseThrow(() -> new BookNotFoundException("Book with id " + source + " cannot be found!"));
    }
}
