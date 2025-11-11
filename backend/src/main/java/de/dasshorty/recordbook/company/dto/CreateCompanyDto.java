package de.dasshorty.recordbook.company.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateCompanyDto(@NotBlank(message = "name of the company is required") String companyName) {
}
