package de.dasshorty.recordbook.company;

import de.dasshorty.recordbook.company.dto.CompanyDto;
import de.dasshorty.recordbook.company.dto.CreateCompanyDto;
import de.dasshorty.recordbook.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "companyName is required")
    private String companyName;

    @ManyToMany
    private List<User> users = new ArrayList<>();

    public Company(String companyName, List<User> users) {
        this.companyName = companyName;
        this.users = users;
    }

    public CompanyDto toDto() {
        return new CompanyDto(this.id, this.companyName, this.users.stream().map(User::getId).map(UUID::toString).toList());
    }

    public static Company fromDto(CreateCompanyDto dto) {
        return new Company(dto.companyName(), new ArrayList<>());
    }
}
