package de.dasshorty.recordbook.company.httpbodies;

import jakarta.validation.constraints.NotBlank;

import java.util.List;
import java.util.UUID;

public record CompanyDto(UUID id, @NotBlank(message = "name of the company is required") String companyName, List<String> users) {
}
