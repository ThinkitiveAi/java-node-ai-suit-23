package com.healthfirst.server.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Embeddable
@Schema(description = "Clinic address information")
public class ClinicAddress {

    @Schema(description = "Street address", example = "123 Medical Center Dr", maxLength = 200)
    @NotBlank(message = "Street address is required")
    @Size(max = 200, message = "Street address cannot exceed 200 characters")
    @Column(name = "street", nullable = false)
    private String street;

    @Schema(description = "City name", example = "New York", maxLength = 100)
    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City cannot exceed 100 characters")
    @Column(name = "city", nullable = false)
    private String city;

    @Schema(description = "State or province", example = "NY", maxLength = 50)
    @NotBlank(message = "State is required")
    @Size(max = 50, message = "State cannot exceed 50 characters")
    @Column(name = "state", nullable = false)
    private String state;

    @Schema(description = "ZIP or postal code", example = "10001")
    @NotBlank(message = "ZIP code is required")
    @Pattern(regexp = "^[0-9]{5}(-[0-9]{4})?$", message = "ZIP code must be in valid format (e.g., 12345 or 12345-6789)")
    @Column(name = "zip", nullable = false)
    private String zip;

    // Constructors
    public ClinicAddress() {}

    public ClinicAddress(String street, String city, String state, String zip) {
        this.street = street;
        this.city = city;
        this.state = state;
        this.zip = zip;
    }

    // Getters and Setters
    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    @Override
    public String toString() {
        return "ClinicAddress{" +
                "street='" + street + '\'' +
                ", city='" + city + '\'' +
                ", state='" + state + '\'' +
                ", zip='" + zip + '\'' +
                '}';
    }
} 