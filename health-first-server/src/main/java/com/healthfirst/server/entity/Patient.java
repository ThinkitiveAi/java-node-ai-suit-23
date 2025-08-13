package com.healthfirst.server.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "patients", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"email"}),
    @UniqueConstraint(columnNames = {"phone_number"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, updatable = false)
    private UUID uuid = UUID.randomUUID();

    @NotBlank @Size(min = 2, max = 50)
    @Column(nullable = false)
    private String firstName;

    @NotBlank @Size(min = 2, max = 50)
    @Column(nullable = false)
    private String lastName;

    @NotBlank @Email
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Pattern(regexp = "^\\+[1-9]\\d{1,14}$")
    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @NotBlank
    @Column(nullable = false)
    private String passwordHash;

    @NotNull
    @Past
    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Embedded
    @NotNull
    private Address address;

    @Embedded
    private EmergencyContact emergencyContact;

    @ElementCollection
    private List<String> medicalHistory;

    @Embedded
    private InsuranceInfo insuranceInfo;

    @Column(nullable = false)
    private Boolean emailVerified = false;

    @Column(nullable = false)
    private Boolean phoneVerified = false;

    @Column(nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    private ZonedDateTime updatedAt;

    public enum Gender {
        MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
    }

    @PrePersist
    @PreUpdate
    private void validateAge() {
        if (dateOfBirth != null && Period.between(dateOfBirth, LocalDate.now()).getYears() < 13) {
            throw new IllegalArgumentException("Patient must be at least 13 years old");
        }
    }
} 