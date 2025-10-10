package de.dasshorty.recordbook;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableJpaRepositories
@RestController
public class RecordbookApplication {

    public static void main(String[] args) {
        SpringApplication.run(RecordbookApplication.class, args);
    }

    @GetMapping(produces = "application/json")
    public String index() {
        return "{\"status\":\"running\"}";
    }
}
