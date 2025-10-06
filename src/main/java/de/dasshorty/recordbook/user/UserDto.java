package de.dasshorty.recordbook.user;

import de.dasshorty.recordbook.company.CompanyDto;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
public class UserDto implements UserDetails {

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
    @Column
    private UserType userType;
    @ManyToOne
    private CompanyDto assignedCompany;

    public UserDto(String forename, String surname, String email, String password, List<Authority> authorities, UserType userType) {
        this.forename = forename;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.userType = userType;
    }

    public UserDto() {
    }

    public UserType getUserType() {
        return userType;
    }

    public CompanyDto getAssignedCompany() {
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
}
