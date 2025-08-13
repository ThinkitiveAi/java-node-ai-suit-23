package com.healthfirst.server.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class InsuranceInfo {
    private String provider;
    private String policyNumber;
} 