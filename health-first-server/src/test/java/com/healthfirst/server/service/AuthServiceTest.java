package com.healthfirst.server.service;

import com.healthfirst.server.dto.LoginRequest;
import com.healthfirst.server.dto.LoginResponse;
import com.healthfirst.server.entity.ClinicAddress;
import com.healthfirst.server.entity.Provider;
import com.healthfirst.server.repository.ProviderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private ProviderRepository providerRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private Provider mockProvider;
    private LoginRequest validLoginRequest;
    private UUID testUuid;

    @BeforeEach
    void setUp() {
        testUuid = UUID.randomUUID();
        
        // Create mock provider
        mockProvider = new Provider();
        mockProvider.setId(1L);
        mockProvider.setUuid(testUuid);
        mockProvider.setFirstName("John");
        mockProvider.setLastName("Doe");
        mockProvider.setEmail("john.doe@clinic.com");
        mockProvider.setPhoneNumber("+1234567890");
        mockProvider.setPasswordHash("hashedPassword");
        mockProvider.setSpecialization("Cardiology");
        mockProvider.setLicenseNumber("MD123456789");
        mockProvider.setYearsOfExperience(10);
        mockProvider.setVerificationStatus(Provider.VerificationStatus.VERIFIED);
        mockProvider.setIsActive(true);
        
        ClinicAddress address = new ClinicAddress();
        address.setStreet("123 Medical Center Dr");
        address.setCity("New York");
        address.setState("NY");
        address.setZip("10001");
        mockProvider.setClinicAddress(address);

        // Create valid login request
        validLoginRequest = new LoginRequest();
        validLoginRequest.setEmail("john.doe@clinic.com");
        validLoginRequest.setPassword("SecurePassword123!");
    }

    @Test
    void login_Success() {
        // Arrange
        when(providerRepository.findByEmail(validLoginRequest.getEmail()))
                .thenReturn(Optional.of(mockProvider));
        when(passwordEncoder.matches(validLoginRequest.getPassword(), mockProvider.getPasswordHash()))
                .thenReturn(true);
        when(jwtService.generateToken(mockProvider)).thenReturn("jwt-token-here");
        when(jwtService.getExpirationTime()).thenReturn(3600L);

        // Act
        LoginResponse response = authService.login(validLoginRequest);

        // Assert
        assertNotNull(response);
        assertEquals("jwt-token-here", response.getAccessToken());
        assertEquals(3600L, response.getExpiresIn());
        assertEquals("Bearer", response.getTokenType());
        assertNotNull(response.getProvider());
        assertEquals("john.doe@clinic.com", response.getProvider().getEmail());
        assertEquals("John", response.getProvider().getFirstName());
        assertEquals("Doe", response.getProvider().getLastName());

        verify(providerRepository).findByEmail(validLoginRequest.getEmail());
        verify(passwordEncoder).matches(validLoginRequest.getPassword(), mockProvider.getPasswordHash());
        verify(jwtService).generateToken(mockProvider);
        verify(jwtService).getExpirationTime();
    }

    @Test
    void login_InvalidEmail() {
        // Arrange
        when(providerRepository.findByEmail(validLoginRequest.getEmail()))
                .thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> authService.login(validLoginRequest));
        assertEquals("Invalid credentials", exception.getMessage());
    }

    @Test
    void login_InvalidPassword() {
        // Arrange
        when(providerRepository.findByEmail(validLoginRequest.getEmail()))
                .thenReturn(Optional.of(mockProvider));
        when(passwordEncoder.matches(validLoginRequest.getPassword(), mockProvider.getPasswordHash()))
                .thenReturn(false);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> authService.login(validLoginRequest));
        assertEquals("Invalid credentials", exception.getMessage());
    }

    @Test
    void login_InactiveAccount() {
        // Arrange
        mockProvider.setIsActive(false);
        when(providerRepository.findByEmail(validLoginRequest.getEmail()))
                .thenReturn(Optional.of(mockProvider));
        when(passwordEncoder.matches(validLoginRequest.getPassword(), mockProvider.getPasswordHash()))
                .thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> authService.login(validLoginRequest));
        assertEquals("Account is deactivated", exception.getMessage());
    }

    @Test
    void login_UnverifiedAccount() {
        // Arrange
        mockProvider.setVerificationStatus(Provider.VerificationStatus.PENDING);
        when(providerRepository.findByEmail(validLoginRequest.getEmail()))
                .thenReturn(Optional.of(mockProvider));
        when(passwordEncoder.matches(validLoginRequest.getPassword(), mockProvider.getPasswordHash()))
                .thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> authService.login(validLoginRequest));
        assertEquals("Account is not verified. Please wait for verification.", exception.getMessage());
    }

    @Test
    void logout_Success() {
        // Arrange
        String token = "test-jwt-token";

        // Act
        authService.logout(token);

        // Assert
        assertTrue(authService.isTokenBlacklisted(token));
    }

    @Test
    void logout_WithBearerPrefix() {
        // Arrange
        String token = "Bearer test-jwt-token";

        // Act
        authService.logout(token);

        // Assert
        assertTrue(authService.isTokenBlacklisted("test-jwt-token"));
    }

    @Test
    void getProviderFromToken_Success() {
        // Arrange
        String token = "valid-jwt-token";
        when(jwtService.validateToken(token)).thenReturn(true);
        when(jwtService.isTokenExpired(token)).thenReturn(false);
        when(jwtService.extractProviderId(token)).thenReturn(testUuid);
        when(providerRepository.findByUuid(testUuid)).thenReturn(Optional.of(mockProvider));

        // Act
        Provider result = authService.getProviderFromToken(token);

        // Assert
        assertNotNull(result);
        assertEquals(testUuid, result.getUuid());
        assertEquals("john.doe@clinic.com", result.getEmail());
    }

    @Test
    void getProviderFromToken_InvalidToken() {
        // Arrange
        String token = "invalid-jwt-token";
        when(jwtService.validateToken(token)).thenReturn(false);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> authService.getProviderFromToken(token));
        assertEquals("Invalid token", exception.getMessage());
    }

    @Test
    void getProviderFromToken_ExpiredToken() {
        // Arrange
        String token = "expired-jwt-token";
        when(jwtService.validateToken(token)).thenReturn(true);
        when(jwtService.isTokenExpired(token)).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> authService.getProviderFromToken(token));
        assertEquals("Token has expired", exception.getMessage());
    }

    @Test
    void getProviderFromToken_BlacklistedToken() {
        // Arrange
        String token = "blacklisted-jwt-token";
        authService.logout(token);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> authService.getProviderFromToken(token));
        assertEquals("Token has been invalidated", exception.getMessage());
    }

    @Test
    void validateToken_Success() {
        // Arrange
        String token = "valid-jwt-token";
        when(jwtService.validateToken(token)).thenReturn(true);
        when(jwtService.isTokenExpired(token)).thenReturn(false);

        // Act
        boolean result = authService.validateToken(token);

        // Assert
        assertTrue(result);
    }

    @Test
    void validateToken_InvalidToken() {
        // Arrange
        String token = "invalid-jwt-token";
        when(jwtService.validateToken(token)).thenReturn(false);

        // Act
        boolean result = authService.validateToken(token);

        // Assert
        assertFalse(result);
    }

    @Test
    void validateToken_ExpiredToken() {
        // Arrange
        String token = "expired-jwt-token";
        when(jwtService.validateToken(token)).thenReturn(true);
        when(jwtService.isTokenExpired(token)).thenReturn(true);

        // Act
        boolean result = authService.validateToken(token);

        // Assert
        assertFalse(result);
    }

    @Test
    void validateToken_BlacklistedToken() {
        // Arrange
        String token = "blacklisted-jwt-token";
        authService.logout(token);

        // Act
        boolean result = authService.validateToken(token);

        // Assert
        assertFalse(result);
    }
} 