package de.dasshorty.recordbook.user.httpbodies;

import de.dasshorty.recordbook.company.CompanyDto;
import de.dasshorty.recordbook.user.Authority;
import de.dasshorty.recordbook.user.UserType;

import java.util.List;

public record AdvancedUserBody(String forename, String surname, String email, UserType userType,
                               CompanyDto assignedCompany, List<Authority> authorities) {
}
