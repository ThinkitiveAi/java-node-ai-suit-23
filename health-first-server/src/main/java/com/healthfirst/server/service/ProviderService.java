package com.healthfirst.server.service;

import com.healthfirst.server.dto.ProviderRegistrationRequest;
import com.healthfirst.server.dto.ProviderResponse;
import com.healthfirst.server.entity.Provider;
import com.healthfirst.server.repository.ProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProviderService {

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ProviderResponse registerProvider(ProviderRegistrationRequest request) {
        // Validate password confirmation
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and confirmation password do not match");
        }

        // Check for existing email
        if (providerRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Check for existing phone number
        if (providerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number already exists");
        }

        // Check for existing license number
        if (providerRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new IllegalArgumentException("License number already exists");
        }

        // Create new provider
        Provider provider = new Provider();
        provider.setFirstName(request.getFirstName());
        provider.setLastName(request.getLastName());
        provider.setEmail(request.getEmail());
        provider.setPhoneNumber(request.getPhoneNumber());
        provider.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        provider.setSpecialization(request.getSpecialization());
        provider.setLicenseNumber(request.getLicenseNumber());
        provider.setYearsOfExperience(request.getYearsOfExperience());
        provider.setClinicAddress(request.getClinicAddress());

        Provider savedProvider = providerRepository.save(provider);
        return new ProviderResponse(savedProvider);
    }

    public ProviderResponse getProviderByUuid(UUID uuid) {
        Provider provider = providerRepository.findByUuid(uuid)
                .orElseThrow(() -> new IllegalArgumentException("Provider not found with UUID: " + uuid));
        return new ProviderResponse(provider);
    }

    public ProviderResponse updateProvider(UUID uuid, ProviderRegistrationRequest request) {
        Provider provider = providerRepository.findByUuid(uuid)
                .orElseThrow(() -> new IllegalArgumentException("Provider not found with UUID: " + uuid));

        // Check if email is being changed and if it already exists
        if (!provider.getEmail().equals(request.getEmail()) && 
            providerRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Check if phone number is being changed and if it already exists
        if (!provider.getPhoneNumber().equals(request.getPhoneNumber()) && 
            providerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number already exists");
        }

        // Check if license number is being changed and if it already exists
        if (!provider.getLicenseNumber().equals(request.getLicenseNumber()) && 
            providerRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new IllegalArgumentException("License number already exists");
        }

        // Update provider fields
        provider.setFirstName(request.getFirstName());
        provider.setLastName(request.getLastName());
        provider.setEmail(request.getEmail());
        provider.setPhoneNumber(request.getPhoneNumber());
        provider.setSpecialization(request.getSpecialization());
        provider.setLicenseNumber(request.getLicenseNumber());
        provider.setYearsOfExperience(request.getYearsOfExperience());
        provider.setClinicAddress(request.getClinicAddress());

        // Update password if provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                throw new IllegalArgumentException("Password and confirmation password do not match");
            }
            provider.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        Provider updatedProvider = providerRepository.save(provider);
        return new ProviderResponse(updatedProvider);
    }

    public void deleteProvider(UUID uuid) {
        Provider provider = providerRepository.findByUuid(uuid)
                .orElseThrow(() -> new IllegalArgumentException("Provider not found with UUID: " + uuid));
        
        // Soft delete - set isActive to false
        provider.setIsActive(false);
        providerRepository.save(provider);
    }

    public Page<ProviderResponse> getAllProviders(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
            Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Provider> providers = providerRepository.findAll(pageable);
        
        return providers.map(ProviderResponse::new);
    }

    public Page<ProviderResponse> searchProviders(String search, String verificationStatus, 
                                                Boolean isActive, int page, int size, 
                                                String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
            Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Provider.VerificationStatus status = null;
        if (verificationStatus != null && !verificationStatus.isEmpty()) {
            try {
                status = Provider.VerificationStatus.valueOf(verificationStatus.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid verification status: " + verificationStatus);
            }
        }

        Page<Provider> providers = providerRepository.searchProviders(search, 
            status != null ? status.name() : null, isActive, pageable);
        
        return providers.map(ProviderResponse::new);
    }

    public Page<ProviderResponse> getActiveProviders(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
            Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Provider> providers = providerRepository.findAllActive(pageable);
        
        return providers.map(ProviderResponse::new);
    }

    public List<ProviderResponse> getAllProvidersList() {
        List<Provider> providers = providerRepository.findAll();
        return providers.stream()
                .map(ProviderResponse::new)
                .collect(Collectors.toList());
    }

    public boolean existsByUuid(UUID uuid) {
        return providerRepository.findByUuid(uuid).isPresent();
    }

    public long countByVerificationStatus(Provider.VerificationStatus status) {
        return providerRepository.countByVerificationStatus(status);
    }

    public long countByIsActive(boolean isActive) {
        return providerRepository.countByIsActive(isActive);
    }
} 