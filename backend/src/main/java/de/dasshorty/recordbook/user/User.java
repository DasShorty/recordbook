package de.dasshorty.recordbook.user;

import de.dasshorty.recordbook.user.dto.CreateUserDto;
import de.dasshorty.recordbook.user.dto.UserDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@SuppressWarnings("FieldCanBeLocal")
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

    @Setter
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Authority authority;

    @Column
    private boolean expired = false;

    @Column
    private boolean locked = false;

    @Column
    private boolean enabled = true;

    @Enumerated(EnumType.STRING)
    private UserType userType;

    public User(
        String forename,
        String surname,
        String email,
        String password,
        Authority authority,
        UserType userType
    ) {
        this.forename = forename;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.authority = authority;
        this.userType = userType;
    }

    public static User fromDto(CreateUserDto dto) {
        return new User(
            dto.forename(),
            dto.surname(),
            dto.email(),
            dto.password(),
            dto.userType().getAuthority(),
            dto.userType()
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.authority.name()));
    }

    @Override
    public String getUsername() {
        return this.getEmail();
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
        return !this.expired;
    }

    public boolean isAdministrator() {
        return this.authority == Authority.ADMINISTRATOR;
    }

    public UserDto toDto() {
        return new UserDto(
            this.id,
            this.forename,
            this.surname,
            this.email,
            this.userType,
            this.authority
        );
    }
}
