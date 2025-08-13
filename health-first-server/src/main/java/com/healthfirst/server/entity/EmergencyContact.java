package com.healthfirst.server.entity;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.*;
import lombok.Data;

@Embeddable
@Data
public class EmergencyContact {
    @Size(max = 100)
    private String name;
    @Pattern(regexp = "^\\+[1-9]\\d{1,14}$", message = "Phone must be in international format")
    private String phone;
    @Size(max = 50)
    private String relationship;
} 