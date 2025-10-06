package de.dasshorty.recordbook.user.httpbodies;

import de.dasshorty.recordbook.company.CompanyDto;
import de.dasshorty.recordbook.user.UserType;

public record AdvancedUserBody(String forename, String surname, String email, String password, UserType userType, CompanyDto assignedCompany) {
}
