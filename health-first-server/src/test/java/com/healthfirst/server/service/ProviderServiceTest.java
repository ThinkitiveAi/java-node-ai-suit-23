package com.healthfirst.server.service;

import com.healthfirst.server.dto.ProviderRegistrationRequest;
import com.healthfirst.server.dto.ProviderResponse;
import com.healthfirst.server.entity.ClinicAddress;
import com.healthfirst.server.entity.Provider;
import com.healthfirst.server.repository.ProviderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProviderServiceTest {

    @Mock
    private ProviderRepository providerRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private ProviderService providerService;

    private ProviderRegistrationRequest validRequest;
    private Provider mockProvider;
    private UUID testUuid;

    @BeforeEach
    void setUp() {
        testUuid = UUID.randomUUID();
        
        // Create valid request
        validRequest = new ProviderRegistrationRequest();
        validRequest.setFirstName("John");
        validRequest.setLastName("Doe");
        validRequest.setEmail("john.doe@clinic.com");
        validRequest.setPhoneNumber("+1234567890");
        validRequest.setPassword("SecurePass123!");
        validRequest.setConfirmPassword("SecurePass123!");
        validRequest.setSpecialization("Cardiology");
        validRequest.setLicenseNumber("MD123456789");
        validRequest.setYearsOfExperience(10);
        
        ClinicAddress address = new ClinicAddress();
        address.setStreet("123 Medical Center Dr");
        address.setCity("New York");
        address.setState("NY");
        address.setZip("10001");
        validRequest.setClinicAddress(address);

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
        mockProvider.setClinicAddress(address);
        mockProvider.setVerificationStatus(Provider.VerificationStatus.PENDING);
        mockProvider.setIsActive(true);
    }

    @Test
    void registerProvider_Success() {
        // Arrange
        when(providerRepository.existsByEmail(validRequest.getEmail())).thenReturn(false);
        when(providerRepository.existsByPhoneNumber(validRequest.getPhoneNumber())).thenReturn(false);
        when(providerRepository.existsByLicenseNumber(validRequest.getLicenseNumber())).thenReturn(false);
        when(passwordEncoder.encode(validRequest.getPassword())).thenReturn("hashedPassword");
        when(providerRepository.save(any(Provider.class))).thenReturn(mockProvider);

        // Act
        ProviderResponse response = providerService.registerProvider(validRequest);

        // Assert
        assertNotNull(response);
        assertEquals(testUuid, response.getUuid());
        assertEquals("john.doe@clinic.com", response.getEmail());
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());
        assertEquals("Cardiology", response.getSpecialization());
        assertEquals(Provider.VerificationStatus.PENDING, response.getVerificationStatus());
        assertTrue(response.getIsActive());

        verify(providerRepository).existsByEmail(validRequest.getEmail());
        verify(providerRepository).existsByPhoneNumber(validRequest.getPhoneNumber());
        verify(providerRepository).existsByLicenseNumber(validRequest.getLicenseNumber());
        verify(passwordEncoder).encode(validRequest.getPassword());
        verify(providerRepository).save(any(Provider.class));
    }

    @Test
    void registerProvider_PasswordMismatch() {
        // Arrange
        validRequest.setConfirmPassword("DifferentPassword123!");

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> providerService.registerProvider(validRequest));
        assertEquals("Password and confirmation password do not match", exception.getMessage());
    }

    @Test
    void registerProvider_EmailAlreadyExists() {
        // Arrange
        when(providerRepository.existsByEmail(validRequest.getEmail())).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> providerService.registerProvider(validRequest));
        assertEquals("Email already exists", exception.getMessage());
    }

    @Test
    void registerProvider_PhoneNumberAlreadyExists() {
        // Arrange
        when(providerRepository.existsByEmail(validRequest.getEmail())).thenReturn(false);
        when(providerRepository.existsByPhoneNumber(validRequest.getPhoneNumber())).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> providerService.registerProvider(validRequest));
        assertEquals("Phone number already exists", exception.getMessage());
    }

    @Test
    void registerProvider_LicenseNumberAlreadyExists() {
        // Arrange
        when(providerRepository.existsByEmail(validRequest.getEmail())).thenReturn(false);
        when(providerRepository.existsByPhoneNumber(validRequest.getPhoneNumber())).thenReturn(false);
        when(providerRepository.existsByLicenseNumber(validRequest.getLicenseNumber())).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> providerService.registerProvider(validRequest));
        assertEquals("License number already exists", exception.getMessage());
    }

    @Test
    void getProviderByUuid_Success() {
        // Arrange
        when(providerRepository.findByUuid(testUuid)).thenReturn(Optional.of(mockProvider));

        // Act
        ProviderResponse response = providerService.getProviderByUuid(testUuid);

        // Assert
        assertNotNull(response);
        assertEquals(testUuid, response.getUuid());
        assertEquals("john.doe@clinic.com", response.getEmail());
    }

    @Test
    void getProviderByUuid_NotFound() {
        // Arrange
        when(providerRepository.findByUuid(testUuid)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> providerService.getProviderByUuid(testUuid));
        assertEquals("Provider not found with UUID: " + testUuid, exception.getMessage());
    }

    @Test
    void updateProvider_Success() {
        // Arrange
        when(providerRepository.findByUuid(testUuid)).thenReturn(Optional.of(mockProvider));
        when(providerRepository.save(any(Provider.class))).thenReturn(mockProvider);

        // Act
        ProviderResponse response = providerService.updateProvider(testUuid, validRequest);

        // Assert
        assertNotNull(response);
        assertEquals(testUuid, response.getUuid());
        verify(providerRepository).findByUuid(testUuid);
        verify(providerRepository).save(any(Provider.class));
    }

    @Test
    void deleteProvider_Success() {
        // Arrange
        when(providerRepository.findByUuid(testUuid)).thenReturn(Optional.of(mockProvider));
        when(providerRepository.save(any(Provider.class))).thenReturn(mockProvider);

        // Act
        providerService.deleteProvider(testUuid);

        // Assert
        verify(providerRepository).findByUuid(testUuid);
        verify(providerRepository).save(any(Provider.class));
        assertFalse(mockProvider.getIsActive());
    }

    @Test
    void getAllProviders_Success() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<Provider> providerPage = new PageImpl<>(Arrays.asList(mockProvider), pageable, 1);
        when(providerRepository.findAll(any(Pageable.class))).thenReturn(providerPage);

        // Act
        Page<ProviderResponse> response = providerService.getAllProviders(0, 10, "createdAt", "desc");

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        assertEquals(1, response.getContent().size());
        assertEquals(testUuid, response.getContent().get(0).getUuid());
    }

    @Test
    void searchProviders_Success() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<Provider> providerPage = new PageImpl<>(Arrays.asList(mockProvider), pageable, 1);
        when(providerRepository.searchProviders(anyString(), anyString(), any(Boolean.class), any(Pageable.class)))
                .thenReturn(providerPage);

        // Act
        Page<ProviderResponse> response = providerService.searchProviders("john", "PENDING", true, 0, 10, "createdAt", "desc");

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        assertEquals(1, response.getContent().size());
    }

    @Test
    void searchProviders_InvalidVerificationStatus() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> providerService.searchProviders("john", "INVALID_STATUS", true, 0, 10, "createdAt", "desc"));
        assertEquals("Invalid verification status: INVALID_STATUS", exception.getMessage());
    }
} 