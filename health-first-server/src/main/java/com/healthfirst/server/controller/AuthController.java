package com.healthfirst.server.controller;

import com.healthfirst.server.dto.ApiResponse;
import com.healthfirst.server.dto.LoginRequest;
import com.healthfirst.server.dto.LoginResponse;
import com.healthfirst.server.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/provider")
@CrossOrigin(origins = "*")
@Tag(name = "Provider Authentication", description = "APIs for provider authentication and session management")
public class AuthController {

    @Autowired
    private AuthService authService;

    // POST /api/v1/provider/login
    @PostMapping("/login")
    @Operation(
        summary = "Provider login",
        description = "Authenticate a provider with email and password, returning a JWT access token"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Login successful",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = com.healthfirst.server.dto.ApiResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Invalid credentials"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorData = new HashMap<>();
            errorData.put("error_code", "INVALID_CREDENTIALS");
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid credentials"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred during login"));
        }
    }

    // POST /api/v1/provider/logout
    @PostMapping("/logout")
    @Operation(
        summary = "Provider logout",
        description = "Logout a provider and invalidate their JWT token"
    )
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Logout successful"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<String>> logout(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                authService.logout(token);
            }
            
            return ResponseEntity.ok(ApiResponse.success("Logout successful", "Successfully logged out"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred during logout"));
        }
    }

    // GET /api/v1/provider/me
    @GetMapping("/me")
    @Operation(
        summary = "Get current provider information",
        description = "Retrieve information about the currently authenticated provider"
    )
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Provider information retrieved successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentProvider(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Authorization header is required"));
            }
            
            String token = authHeader.substring(7);
            var provider = authService.getProviderFromToken(token);
            
            Map<String, Object> providerData = new HashMap<>();
            providerData.put("uuid", provider.getUuid());
            providerData.put("email", provider.getEmail());
            providerData.put("firstName", provider.getFirstName());
            providerData.put("lastName", provider.getLastName());
            providerData.put("specialization", provider.getSpecialization());
            providerData.put("verificationStatus", provider.getVerificationStatus());
            providerData.put("isActive", provider.getIsActive());
            
            return ResponseEntity.ok(ApiResponse.success("Provider information retrieved successfully", providerData));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred while retrieving provider information"));
        }
    }

    // POST /api/v1/provider/validate-token
    @PostMapping("/validate-token")
    @Operation(
        summary = "Validate JWT token",
        description = "Validate a JWT token and return token information if valid"
    )
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Token validation completed"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Invalid token"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Map<String, Object>>> validateToken(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Authorization header is required"));
            }
            
            String token = authHeader.substring(7);
            boolean isValid = authService.validateToken(token);
            
            Map<String, Object> validationData = new HashMap<>();
            validationData.put("valid", isValid);
            
            if (isValid) {
                validationData.put("email", authService.getEmailFromToken(token));
                validationData.put("role", authService.getRoleFromToken(token));
                validationData.put("specialization", authService.getSpecializationFromToken(token));
                validationData.put("verificationStatus", authService.getVerificationStatusFromToken(token));
            }
            
            return ResponseEntity.ok(ApiResponse.success("Token validation completed", validationData));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred while validating token"));
        }
    }
} 