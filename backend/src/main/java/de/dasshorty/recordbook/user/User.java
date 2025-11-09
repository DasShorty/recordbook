package de.dasshorty.recordbook.user;

import de.dasshorty.recordbook.company.Company;
import de.dasshorty.recordbook.user.dto.AdvancedUserDto;
import de.dasshorty.recordbook.user.dto.UserDto;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@SuppressWarnings("FieldCanBeLocal")
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column
    private String forename;
    @Column
    private String surname;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    @Enumerated(EnumType.STRING)
    @ElementCollection(fetch = FetchType.EAGER)
    private List<Authority> authorities;
    @Column
    private boolean expired = false;
    @Column
    private boolean locked = false;
    @Column
    private boolean credentialsExpired = false;
    @Column
    private boolean enabled = true;
    @Enumerated(EnumType.STRING)
    private UserType userType;
    @ManyToOne
    @JoinColumn
    private Company assignedCompany;

    public User(String forename, String surname, String email, String password, List<Authority> authorities, UserType userType) {
        this.forename = forename;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.userType = userType;
    }

    public User() {
    }

    public User(String forename, String surname, String email, String password, List<Authority> authorities, UserType userType, Company assignedCompany) {
        this.forename = forename;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.userType = userType;
        this.assignedCompany = assignedCompany;
    }

    public UserType getUserType() {
        return userType;
    }

    public Company getAssignedCompany() {
        return assignedCompany;
    }

    public UUID getId() {
        return id;
    }

    public String getForename() {
        return forename;
    }

    public String getSurname() {
        return surname;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities.stream().map(authority -> new SimpleGrantedAuthority(authority.name().toUpperCase())).toList();
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return !this.expired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !this.locked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return !this.credentialsExpired;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }

    public boolean isAdministrator() {
        return this.authorities.contains(Authority.ADMINISTRATOR);
    }

    public AdvancedUserDto transformToBody() {
        return new AdvancedUserDto(this.id, this.forename, this.surname, this.email, this.userType, this.assignedCompany, this.authorities);
    }

    public UserDto transformToDto() {
        return new UserDto(this.id, this.forename, this.surname, this.userType);
    }
}
