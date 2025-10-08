package de.dasshorty.recordbook.book.httpbodies;

import de.dasshorty.recordbook.book.BookDto;
import de.dasshorty.recordbook.job.JobDto;
import de.dasshorty.recordbook.user.httpbodies.UserBody;

import java.util.List;
import java.util.UUID;

public record BookBody(UUID id, UserBody trainee, List<UserBody> trainers, JobDto qualifiedJob) {

    public static BookBody fromBook(BookDto book) {
        return new BookBody(
                book.getId(),
                UserBody.fromUser(book.getTrainee()),
                book.getTrainers().stream().map(UserBody::fromUser).toList(),
                book.getQualifiedJob()
        );
    }

}
