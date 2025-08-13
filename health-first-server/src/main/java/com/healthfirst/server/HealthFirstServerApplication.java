package com.healthfirst.server;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration;

@SpringBootApplication(exclude = {KafkaAutoConfiguration.class})
public class HealthFirstServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(HealthFirstServerApplication.class, args);
    }

} 