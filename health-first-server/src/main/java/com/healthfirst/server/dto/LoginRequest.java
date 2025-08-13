package com.healthfirst.server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Provider login request")
public class LoginRequest {

    @Schema(description = "Provider's email address", example = "john.doe@clinic.com")
    @Email(message = "Email must be a valid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @Schema(description = "Provider's password", example = "SecurePassword123!")
    @NotBlank(message = "Password is required")
    private String password;

    // Constructors
    public LoginRequest() {}

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
} 