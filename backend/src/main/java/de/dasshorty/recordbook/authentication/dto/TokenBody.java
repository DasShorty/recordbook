package de.dasshorty.recordbook.authentication.dto;

public record TokenBody(String accessToken, String refreshToken) {
}
