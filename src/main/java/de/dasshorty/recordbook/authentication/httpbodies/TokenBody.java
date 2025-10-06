package de.dasshorty.recordbook.authentication.httpbodies;

public record TokenBody(String accessToken, String refreshToken) {
}
