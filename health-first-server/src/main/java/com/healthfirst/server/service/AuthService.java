package com.healthfirst.server.service;

import com.healthfirst.server.dto.LoginRequest;
import com.healthfirst.server.dto.LoginResponse;
import com.healthfirst.server.entity.Provider;
import com.healthfirst.server.repository.ProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    // In-memory token blacklist for logout (in production, use Redis)
    private final Set<String> blacklistedTokens = new HashSet<>();

    public LoginResponse login(LoginRequest loginRequest) {
        // Find provider by email
        Provider provider = providerRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        // Verify password
        if (!passwordEncoder.matches(loginRequest.getPassword(), provider.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        // Check if account is active
        if (!provider.getIsActive()) {
            throw new IllegalArgumentException("Account is deactivated");
        }

        // Check if account is verified (optional - you can remove this check if not required)
        if (provider.getVerificationStatus() != Provider.VerificationStatus.VERIFIED) {
            throw new IllegalArgumentException("Account is not verified. Please wait for verification.");
        }

        // Generate JWT token
        String token = jwtService.generateToken(provider);

        // Return login response
        return new LoginResponse(token, jwtService.getExpirationTime(), provider);
    }

    public void logout(String token) {
        // Remove "Bearer " prefix if present
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // Add token to blacklist
        if (token != null && !token.isEmpty()) {
            blacklistedTokens.add(token);
        }
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }

    public Provider getProviderFromToken(String token) {
        // Remove "Bearer " prefix if present
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (token == null || token.isEmpty()) {
            throw new IllegalArgumentException("Token is required");
        }

        // Check if token is blacklisted
        if (isTokenBlacklisted(token)) {
            throw new IllegalArgumentException("Token has been invalidated");
        }

        // Validate token
        if (!jwtService.validateToken(token)) {
            throw new IllegalArgumentException("Invalid token");
        }

        // Check if token is expired
        if (jwtService.isTokenExpired(token)) {
            throw new IllegalArgumentException("Token has expired");
        }

        // Extract provider ID and get provider
        UUID providerId = jwtService.extractProviderId(token);
        return providerRepository.findByUuid(providerId)
                .orElseThrow(() -> new IllegalArgumentException("Provider not found"));
    }

    public boolean validateToken(String token) {
        // Remove "Bearer " prefix if present
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (token == null || token.isEmpty()) {
            return false;
        }

        // Check if token is blacklisted
        if (isTokenBlacklisted(token)) {
            return false;
        }

        // Validate token structure and signature
        if (!jwtService.validateToken(token)) {
            return false;
        }

        // Check if token is expired
        if (jwtService.isTokenExpired(token)) {
            return false;
        }

        return true;
    }

    public String getEmailFromToken(String token) {
        // Remove "Bearer " prefix if present
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        return jwtService.extractEmail(token);
    }

    public UUID getProviderIdFromToken(String token) {
        // Remove "Bearer " prefix if present
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        return jwtService.extractProviderId(token);
    }

    public String getRoleFromToken(String token) {
        // Remove "Bearer " prefix if present
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        return jwtService.extractRole(token);
    }

    public String getSpecializationFromToken(String token) {
        // Remove "Bearer " prefix if present
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        return jwtService.extractSpecialization(token);
    }

    public String getVerificationStatusFromToken(String token) {
        // Remove "Bearer " prefix if present
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        return jwtService.extractVerificationStatus(token);
    }
} 