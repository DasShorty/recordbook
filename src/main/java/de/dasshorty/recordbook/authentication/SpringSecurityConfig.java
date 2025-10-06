package de.dasshorty.recordbook.authentication;

import de.dasshorty.recordbook.authentication.jwt.JwtAuthenticationConverter;
import de.dasshorty.recordbook.authentication.jwt.JwtAuthenticationProvider;
import de.dasshorty.recordbook.authentication.jwt.JwtHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.sql.DataSource;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SpringSecurityConfig implements WebMvcConfigurer {

    private final JwtHandler jwtHandler;

    @Autowired
    public SpringSecurityConfig(JwtHandler jwtHandler) {
        this.jwtHandler = jwtHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception {

        AuthenticationFilter authenticationFilter = new AuthenticationFilter(authenticationManager, jwtAuthenticationConverter());
        authenticationFilter.setSuccessHandler((request, response, authentication) -> {
            // do nothing, just continue
        });

        return http.cors(httpSecurityCorsConfigurer -> {
                    httpSecurityCorsConfigurer.configurationSource(request -> {

                        CorsConfiguration config = new CorsConfiguration();

                        config.setAllowedOrigins(List.of("http://localhost:4200", "http://localhost"));
                        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                        config.setAllowCredentials(true);
                        config.setExposedHeaders(List.of("Authorization"));
                        config.setAllowedHeaders(List.of(
                                "Access-Control-Allow-Headers", "Access-Control-Allow-Origin", "Access-Control-Request-Method",
                                "Access-Control-Request-Headers", "Origin", "Cache-Control", "Content-Type", "Authorization"
                        ));

                        config.setMaxAge(3600L);

                        return config;

                    });
                }).csrf(httpSecurityCsrfConfigurer -> httpSecurityCsrfConfigurer.disable())
                .sessionManagement(Customizer.withDefaults()).sessionManagement(
                        sessionManagementConfigurer -> sessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers(HttpMethod.OPTIONS).permitAll()
                                .requestMatchers("/authentication/**", "/authentication/login").permitAll()
                                .anyRequest().authenticated())
                .authenticationProvider(this.recordBookAuthenticationProvider(this.jwtHandler)).addFilter(authenticationFilter).build();
    }

    @Bean
    public JwtAuthenticationProvider recordBookAuthenticationProvider(JwtHandler jwtHandler) {
        return new JwtAuthenticationProvider(jwtHandler);
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        return new JwtAuthenticationConverter();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(DataSource dataSource) {
        return new JdbcUserDetailsManager(dataSource);
    }

}
