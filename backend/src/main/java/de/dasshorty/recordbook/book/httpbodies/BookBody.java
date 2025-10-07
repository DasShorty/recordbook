package de.dasshorty.recordbook.book.httpbodies;

import de.dasshorty.recordbook.book.BookDto;
import de.dasshorty.recordbook.job.JobDto;
import de.dasshorty.recordbook.user.httpbodies.SafeUserBody;

import java.util.List;
import java.util.UUID;

public record BookBody(UUID id, SafeUserBody trainee, List<SafeUserBody> trainers, JobDto qualifiedJob) {

    public static BookBody fromBook(BookDto book) {
        return new BookBody(
                book.getId(),
                SafeUserBody.fromUser(book.getTrainee()),
                book.getTrainers().stream().map(SafeUserBody::fromUser).toList(),
                book.getQualifiedJob()
        );
    }

}
