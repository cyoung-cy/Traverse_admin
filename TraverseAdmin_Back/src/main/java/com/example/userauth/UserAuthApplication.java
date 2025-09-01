package com.example.userauth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EntityScan(basePackages = "com.example.userauth.model")
@EnableJpaRepositories(basePackages = "com.example.userauth.repository")
public class UserAuthApplication {

    public static void main(String[] args) {

        SpringApplication.run(UserAuthApplication.class, args);
    }

}
