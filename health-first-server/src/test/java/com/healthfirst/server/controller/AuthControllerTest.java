package com.healthfirst.server.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthfirst.server.dto.LoginRequest;
import com.healthfirst.server.entity.ClinicAddress;
import com.healthfirst.server.entity.Provider;
import com.healthfirst.server.repository.ProviderRepository;
import com.healthfirst.server.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AuthControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;
    private Provider testProvider;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        objectMapper = new ObjectMapper();

        // Create test provider
        testProvider = new Provider();
        testProvider.setUuid(UUID.randomUUID());
        testProvider.setFirstName("Test");
        testProvider.setLastName("Provider");
        testProvider.setEmail("test.provider@clinic.com");
        testProvider.setPhoneNumber("+1234567890");
        testProvider.setPasswordHash(passwordEncoder.encode("SecurePassword123!"));
        testProvider.setSpecialization("Cardiology");
        testProvider.setLicenseNumber("MD123456789");
        testProvider.setYearsOfExperience(5);
        testProvider.setVerificationStatus(Provider.VerificationStatus.VERIFIED);
        testProvider.setIsActive(true);

        ClinicAddress address = new ClinicAddress();
        address.setStreet("123 Test St");
        address.setCity("Test City");
        address.setState("TS");
        address.setZip("12345");
        testProvider.setClinicAddress(address);

        providerRepository.save(testProvider);
    }

    @Test
    void login_Success() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test.provider@clinic.com");
        loginRequest.setPassword("SecurePassword123!");

        mockMvc.perform(post("/api/v1/provider/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.data").exists())
                .andExpect(jsonPath("$.data.provider.email").value("test.provider@clinic.com"))
                .andExpect(jsonPath("$.data.provider.firstName").value("Test"))
                .andExpect(jsonPath("$.data.provider.lastName").value("Provider"));
    }

    @Test
    void login_InvalidCredentials() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test.provider@clinic.com");
        loginRequest.setPassword("WrongPassword123!");

        mockMvc.perform(post("/api/v1/provider/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }

    @Test
    void login_NonExistentEmail() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("nonexistent@clinic.com");
        loginRequest.setPassword("SecurePassword123!");

        mockMvc.perform(post("/api/v1/provider/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }

    @Test
    void login_InvalidEmailFormat() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("invalid-email");
        loginRequest.setPassword("SecurePassword123!");

        mockMvc.perform(post("/api/v1/provider/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_EmptyPassword() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test.provider@clinic.com");
        loginRequest.setPassword("");

        mockMvc.perform(post("/api/v1/provider/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_InactiveAccount() throws Exception {
        // Set provider as inactive
        testProvider.setIsActive(false);
        providerRepository.save(testProvider);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test.provider@clinic.com");
        loginRequest.setPassword("SecurePassword123!");

        mockMvc.perform(post("/api/v1/provider/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }

    @Test
    void login_UnverifiedAccount() throws Exception {
        // Set provider as unverified
        testProvider.setVerificationStatus(Provider.VerificationStatus.PENDING);
        providerRepository.save(testProvider);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test.provider@clinic.com");
        loginRequest.setPassword("SecurePassword123!");

        mockMvc.perform(post("/api/v1/provider/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }
}