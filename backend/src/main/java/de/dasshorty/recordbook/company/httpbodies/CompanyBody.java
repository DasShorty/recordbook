package de.dasshorty.recordbook.company.httpbodies;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record CompanyBody(
        @NotBlank(message = "name of the company is required")
        String name,
        List<String> users) {
}
