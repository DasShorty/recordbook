package de.dasshorty.recordbook.company;

import de.dasshorty.recordbook.company.dto.CompanyDto;
import de.dasshorty.recordbook.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "companyName is required")
    private String companyName;

    @ManyToMany
    private List<User> users = new ArrayList<>();

    public UUID getId() {
        return id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public CompanyDto toBody() {
        return new CompanyDto(this.id, this.companyName, this.users.stream().map(User::getId).map(UUID::toString).toList());
    }

    public Company(String companyName, List<User> users) {
        this.companyName = companyName;
        this.users = users;
    }

    public Company() {
    }
}
