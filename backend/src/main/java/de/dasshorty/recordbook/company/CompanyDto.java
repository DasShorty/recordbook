package de.dasshorty.recordbook.company;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "companies")
public class CompanyDto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String companyName;
}
