package com.healthfirst.server.controller;

import com.healthfirst.server.dto.ApiResponse;
import com.healthfirst.server.dto.ProviderRegistrationRequest;
import com.healthfirst.server.dto.ProviderResponse;
import com.healthfirst.server.service.ProviderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/provider")
@CrossOrigin(origins = "*")
@Tag(name = "Provider Management", description = "APIs for managing healthcare providers")
public class ProviderController {

    @Autowired
    private ProviderService providerService;

    // POST /api/v1/provider/register
    @PostMapping("/register")
    @Operation(
        summary = "Register a new provider",
        description = "Register a new healthcare provider with comprehensive validation",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ProviderRegistrationRequest.class),
                examples = @ExampleObject(
                    name = "Valid Provider Registration",
                    value = """
                    {
                      "first_name": "John",
                      "last_name": "Doe",
                      "email": "john.doe@clinic.com",
                      "phone_number": "+1234567890",
                      "password": "SecurePassword123!",
                      "confirm_password": "SecurePassword123!",
                      "specialization": "Cardiology",
                      "license_number": "MD123456789",
                      "years_of_experience": 10,
                      "clinic_address": {
                        "street": "123 Medical Center Dr",
                        "city": "New York",
                        "state": "NY",
                        "zip": "10001"
                      }
                    }
                    """
                )
            )
        )
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Provider registered successfully",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = com.healthfirst.server.dto.ApiResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Email or phone number already exists"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Map<String, Object>>> registerProvider(
            @Valid @RequestBody ProviderRegistrationRequest request) {
        try {
            ProviderResponse response = providerService.registerProvider(request);
            
            Map<String, Object> data = new HashMap<>();
            data.put("provider_id", response.getUuid());
            data.put("email", response.getEmail());
            data.put("verification_status", response.getVerificationStatus());
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Provider registered successfully. Verification email sent.", data));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred while registering the provider"));
        }
    }

    // GET /api/v1/provider/{uuid}
    @GetMapping("/{uuid}")
    @Operation(
        summary = "Get provider by UUID",
        description = "Retrieve provider details by their unique UUID"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Provider retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Provider not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<ProviderResponse>> getProviderByUuid(
            @Parameter(description = "Provider UUID", example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable UUID uuid) {
        try {
            ProviderResponse provider = providerService.getProviderByUuid(uuid);
            return ResponseEntity.ok(ApiResponse.success("Provider retrieved successfully", provider));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred while retrieving the provider"));
        }
    }

    // PUT /api/v1/provider/{uuid}
    @PutMapping("/{uuid}")
    @Operation(
        summary = "Update provider by UUID",
        description = "Update provider information by their unique UUID"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Provider updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Provider not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<ProviderResponse>> updateProvider(
            @Parameter(description = "Provider UUID", example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable UUID uuid,
            @Valid @RequestBody ProviderRegistrationRequest request) {
        try {
            ProviderResponse updatedProvider = providerService.updateProvider(uuid, request);
            return ResponseEntity.ok(ApiResponse.success("Provider updated successfully", updatedProvider));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred while updating the provider"));
        }
    }

    // DELETE /api/v1/provider/{uuid}
    @DeleteMapping("/{uuid}")
    @Operation(
        summary = "Delete provider by UUID",
        description = "Soft delete a provider by their unique UUID"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Provider deleted successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Provider not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<String>> deleteProvider(
            @Parameter(description = "Provider UUID", example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable UUID uuid) {
        try {
            providerService.deleteProvider(uuid);
            return ResponseEntity.ok(ApiResponse.success("Provider deleted successfully", "Provider with UUID " + uuid + " has been deleted"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred while deleting the provider"));
        }
    }

    // GET /api/v1/provider/all
    @GetMapping("/all")
    @Operation(
        summary = "Get all providers with pagination",
        description = "Retrieve all providers with pagination, sorting, and filtering options"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Providers retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Page<ProviderResponse>>> getAllProviders(
            @Parameter(description = "Page number (0-based)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size", example = "10")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field", example = "createdAt")
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)", example = "desc")
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Page<ProviderResponse> providers = providerService.getAllProviders(page, size, sortBy, sortDir);
            return ResponseEntity.ok(ApiResponse.success("Providers retrieved successfully", providers));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred while retrieving providers"));
        }
    }

    // GET /api/v1/provider/search
    @GetMapping("/search")
    @Operation(
        summary = "Search providers with filters",
        description = "Search providers with various filters including search term, verification status, and active status"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Search completed successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid search parameters"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Page<ProviderResponse>>> searchProviders(
            @Parameter(description = "Search term for name, email, or specialization")
            @RequestParam(required = false) String search,
            @Parameter(description = "Verification status filter", example = "VERIFIED")
            @RequestParam(required = false) String verificationStatus,
            @Parameter(description = "Active status filter", example = "true")
            @RequestParam(required = false) Boolean isActive,
            @Parameter(description = "Page number (0-based)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size", example = "10")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field", example = "createdAt")
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)", example = "desc")
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Page<ProviderResponse> providers = providerService.searchProviders(
                    search, verificationStatus, isActive, page, size, sortBy, sortDir);
            return ResponseEntity.ok(ApiResponse.success("Providers search completed successfully", providers));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred while searching providers"));
        }
    }

    // GET /api/v1/provider/active
    @GetMapping("/active")
    @Operation(
        summary = "Get active providers",
        description = "Retrieve only active providers with pagination and sorting"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Active providers retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Page<ProviderResponse>>> getActiveProviders(
            @Parameter(description = "Page number (0-based)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size", example = "10")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field", example = "createdAt")
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)", example = "desc")
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Page<ProviderResponse> providers = providerService.getActiveProviders(page, size, sortBy, sortDir);
            return ResponseEntity.ok(ApiResponse.success("Active providers retrieved successfully", providers));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred while retrieving active providers"));
        }
    }

    // GET /api/v1/provider/list
    @GetMapping("/list")
    @Operation(
        summary = "Get all providers list",
        description = "Retrieve all providers as a simple list without pagination"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "All providers retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<ProviderResponse>>> getAllProvidersList() {
        try {
            List<ProviderResponse> providers = providerService.getAllProvidersList();
            return ResponseEntity.ok(ApiResponse.success("All providers retrieved successfully", providers));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred while retrieving providers list"));
        }
    }

    // GET /api/v1/provider/stats
    @GetMapping("/stats")
    @Operation(
        summary = "Get provider statistics",
        description = "Retrieve comprehensive statistics about providers including counts by status"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Provider statistics retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProviderStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("total_providers", providerService.countByIsActive(true) + providerService.countByIsActive(false));
            stats.put("active_providers", providerService.countByIsActive(true));
            stats.put("inactive_providers", providerService.countByIsActive(false));
            stats.put("pending_verification", providerService.countByVerificationStatus(
                    com.healthfirst.server.entity.Provider.VerificationStatus.PENDING));
            stats.put("verified_providers", providerService.countByVerificationStatus(
                    com.healthfirst.server.entity.Provider.VerificationStatus.VERIFIED));
            stats.put("rejected_providers", providerService.countByVerificationStatus(
                    com.healthfirst.server.entity.Provider.VerificationStatus.REJECTED));
            
            return ResponseEntity.ok(ApiResponse.success("Provider statistics retrieved successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred while retrieving provider statistics"));
        }
    }
} 