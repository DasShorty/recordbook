package de.dasshorty.recordbook.company;

import de.dasshorty.recordbook.user.UserDto;
import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "companies")
public class CompanyDto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String companyName;
    @ManyToMany
    private List<UserDto> users;

    public UUID getId() {
        return id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public List<UserDto> getUsers() {
        return users;
    }
}
