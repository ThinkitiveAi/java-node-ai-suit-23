package com.healthfirst.server.dto;

import com.healthfirst.server.entity.Provider;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@Schema(description = "Provider login response")
public class LoginResponse {
    @Schema(description = "JWT access token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String accessToken;
    
    @Schema(description = "Token expiration time in seconds", example = "3600")
    private long expiresIn;
    
    @Schema(description = "Token type", example = "Bearer")
    private String tokenType;
    
    @Schema(description = "Provider information")
    private ProviderData provider;

    public LoginResponse() {
        this.tokenType = "Bearer";
    }

    public LoginResponse(String accessToken, long expiresIn, Provider provider) {
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        this.tokenType = "Bearer";
        this.provider = new ProviderData(provider);
    }

    // Getters and Setters
    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public ProviderData getProvider() {
        return provider;
    }

    public void setProvider(ProviderData provider) {
        this.provider = provider;
    }

    // Inner class for provider data
    @Schema(description = "Provider information in login response")
    public static class ProviderData {
        @Schema(description = "Provider's unique identifier", example = "123e4567-e89b-12d3-a456-426614174000")
        private UUID uuid;
        
        @Schema(description = "Provider's first name", example = "John")
        private String firstName;
        
        @Schema(description = "Provider's last name", example = "Doe")
        private String lastName;
        
        @Schema(description = "Provider's email address", example = "john.doe@clinic.com")
        private String email;
        
        @Schema(description = "Provider's phone number", example = "+1234567890")
        private String phoneNumber;
        
        @Schema(description = "Provider's medical specialization", example = "Cardiology")
        private String specialization;
        
        @Schema(description = "Provider's license number", example = "MD123456789")
        private String licenseNumber;
        
        @Schema(description = "Years of experience", example = "10")
        private Integer yearsOfExperience;
        
        @Schema(description = "Provider's verification status", example = "VERIFIED")
        private Provider.VerificationStatus verificationStatus;
        
        @Schema(description = "Whether the provider account is active", example = "true")
        private Boolean isActive;

        public ProviderData() {}

        public ProviderData(Provider provider) {
            this.uuid = provider.getUuid();
            this.firstName = provider.getFirstName();
            this.lastName = provider.getLastName();
            this.email = provider.getEmail();
            this.phoneNumber = provider.getPhoneNumber();
            this.specialization = provider.getSpecialization();
            this.licenseNumber = provider.getLicenseNumber();
            this.yearsOfExperience = provider.getYearsOfExperience();
            this.verificationStatus = provider.getVerificationStatus();
            this.isActive = provider.getIsActive();
        }

        // Getters and Setters
        public UUID getUuid() {
            return uuid;
        }

        public void setUuid(UUID uuid) {
            this.uuid = uuid;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }

        public String getSpecialization() {
            return specialization;
        }

        public void setSpecialization(String specialization) {
            this.specialization = specialization;
        }

        public String getLicenseNumber() {
            return licenseNumber;
        }

        public void setLicenseNumber(String licenseNumber) {
            this.licenseNumber = licenseNumber;
        }

        public Integer getYearsOfExperience() {
            return yearsOfExperience;
        }

        public void setYearsOfExperience(Integer yearsOfExperience) {
            this.yearsOfExperience = yearsOfExperience;
        }

        public Provider.VerificationStatus getVerificationStatus() {
            return verificationStatus;
        }

        public void setVerificationStatus(Provider.VerificationStatus verificationStatus) {
            this.verificationStatus = verificationStatus;
        }

        public Boolean getIsActive() {
            return isActive;
        }

        public void setIsActive(Boolean isActive) {
            this.isActive = isActive;
        }
    }
} 