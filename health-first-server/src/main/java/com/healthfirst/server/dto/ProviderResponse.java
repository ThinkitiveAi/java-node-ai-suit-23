package com.healthfirst.server.dto;

import com.healthfirst.server.entity.ClinicAddress;
import com.healthfirst.server.entity.Provider;

import java.time.LocalDateTime;
import java.util.UUID;

public class ProviderResponse {
    private UUID uuid;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String specialization;
    private String licenseNumber;
    private Integer yearsOfExperience;
    private ClinicAddress clinicAddress;
    private Provider.VerificationStatus verificationStatus;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProviderResponse() {}

    public ProviderResponse(Provider provider) {
        this.uuid = provider.getUuid();
        this.firstName = provider.getFirstName();
        this.lastName = provider.getLastName();
        this.email = provider.getEmail();
        this.phoneNumber = provider.getPhoneNumber();
        this.specialization = provider.getSpecialization();
        this.licenseNumber = provider.getLicenseNumber();
        this.yearsOfExperience = provider.getYearsOfExperience();
        this.clinicAddress = provider.getClinicAddress();
        this.verificationStatus = provider.getVerificationStatus();
        this.isActive = provider.getIsActive();
        this.createdAt = provider.getCreatedAt();
        this.updatedAt = provider.getUpdatedAt();
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

    public ClinicAddress getClinicAddress() {
        return clinicAddress;
    }

    public void setClinicAddress(ClinicAddress clinicAddress) {
        this.clinicAddress = clinicAddress;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
} 