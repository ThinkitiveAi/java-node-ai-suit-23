package com.healthfirst.server.entity;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.*;
import lombok.Data;


@Embeddable
@Data
public class Address {
    @NotBlank @Size(max = 200)
    private String street;
    @NotBlank @Size(max = 100)
    private String city;
    @NotBlank @Size(max = 50)
    private String state;
    @NotBlank
    @Pattern(regexp = "^[0-9]{5}(-[0-9]{4})?$", message = "ZIP code must be valid")
    private String zip;
} 