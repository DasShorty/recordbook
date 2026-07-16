package de.dasshorty.recordbook.book.week;

import de.dasshorty.recordbook.book.week.exceptions.BookWeekIdConversionFailedException;
import de.dasshorty.recordbook.book.week.exceptions.BookWeekNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class BookWeekConverter implements Converter<String, BookWeek> {

    private final BookWeekRepository bookWeekRepository;

    @Autowired
    public BookWeekConverter(BookWeekRepository bookWeekRepository) {
        this.bookWeekRepository = bookWeekRepository;
    }

    @Override
    public BookWeek convert(String source) {

        if (source == null) {
            throw new BookWeekIdConversionFailedException("Couldn't find a book week id");
        }

        UUID id;

        try {

            id = UUID.fromString(source);

        } catch (IllegalArgumentException e) {
            throw new BookWeekIdConversionFailedException("Failed to convert book week id: " + source);
        }

        return this.bookWeekRepository.findById(id).orElseThrow(() -> new BookWeekNotFoundException("Book week not found: " + source));
    }
}
