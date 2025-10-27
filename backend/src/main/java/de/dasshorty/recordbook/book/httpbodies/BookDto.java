package de.dasshorty.recordbook.book.httpbodies;

import de.dasshorty.recordbook.book.Book;
import de.dasshorty.recordbook.job.Job;
import de.dasshorty.recordbook.user.httpbodies.UserDto;

import java.util.List;
import java.util.UUID;

public record BookDto(UUID id, UserDto trainee, List<UserDto> trainers, Job qualifiedJob) {

    public static BookDto fromBook(Book book) {
        return new BookDto(
                book.getId(),
                UserDto.fromUser(book.getTrainee()),
                book.getTrainers().stream().map(UserDto::fromUser).toList(),
                book.getQualifiedJob()
        );
    }

}
