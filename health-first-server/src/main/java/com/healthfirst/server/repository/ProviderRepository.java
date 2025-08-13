package com.healthfirst.server.repository;

import com.healthfirst.server.entity.Provider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {

    Optional<Provider> findByUuid(UUID uuid);

    Optional<Provider> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByLicenseNumber(String licenseNumber);

    @Query("SELECT p FROM Provider p WHERE p.isActive = true")
    Page<Provider> findAllActive(Pageable pageable);

    @Query("SELECT p FROM Provider p WHERE " +
           "(:firstName IS NULL OR LOWER(p.firstName) LIKE LOWER(CONCAT('%', :firstName, '%'))) AND " +
           "(:lastName IS NULL OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :lastName, '%'))) AND " +
           "(:email IS NULL OR LOWER(p.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
           "(:specialization IS NULL OR LOWER(p.specialization) LIKE LOWER(CONCAT('%', :specialization, '%'))) AND " +
           "(:verificationStatus IS NULL OR p.verificationStatus = :verificationStatus) AND " +
           "(:isActive IS NULL OR p.isActive = :isActive)")
    Page<Provider> findByFilters(
            @Param("firstName") String firstName,
            @Param("lastName") String lastName,
            @Param("email") String email,
            @Param("specialization") String specialization,
            @Param("verificationStatus") Provider.VerificationStatus verificationStatus,
            @Param("isActive") Boolean isActive,
            Pageable pageable
    );

    @Query(value = "SELECT p.* FROM providers p WHERE " +
           "(:search IS NULL OR " +
           "LOWER(p.first_name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.last_name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.specialization) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.license_number) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:verificationStatus IS NULL OR p.verification_status = :verificationStatus) AND " +
           "(:isActive IS NULL OR p.is_active = :isActive)",
           countQuery = "SELECT COUNT(*) FROM providers p WHERE " +
           "(:search IS NULL OR " +
           "LOWER(p.first_name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.last_name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.specialization) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.license_number) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:verificationStatus IS NULL OR p.verification_status = :verificationStatus) AND " +
           "(:isActive IS NULL OR p.is_active = :isActive)",
           nativeQuery = true)
    Page<Provider> searchProviders(
            @Param("search") String search,
            @Param("verificationStatus") String verificationStatus,
            @Param("isActive") Boolean isActive,
            Pageable pageable
    );

    @Query("SELECT COUNT(p) FROM Provider p WHERE p.verificationStatus = :status")
    long countByVerificationStatus(@Param("status") Provider.VerificationStatus status);

    @Query("SELECT COUNT(p) FROM Provider p WHERE p.isActive = :isActive")
    long countByIsActive(@Param("isActive") boolean isActive);
} 