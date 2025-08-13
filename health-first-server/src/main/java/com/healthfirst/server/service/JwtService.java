package com.healthfirst.server.service;

import com.healthfirst.server.config.JwtConfig;
import com.healthfirst.server.entity.Provider;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtService {

    @Autowired
    private JwtConfig jwtConfig;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes());
    }

    public String generateToken(Provider provider) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("provider_id", provider.getUuid().toString());
        claims.put("email", provider.getEmail());
        claims.put("role", "PROVIDER");
        claims.put("specialization", provider.getSpecialization());
        claims.put("verification_status", provider.getVerificationStatus().name());
        
        return createToken(claims, provider.getEmail());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + (jwtConfig.getExpiration() * 1000));

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuer(jwtConfig.getIssuer())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public UUID extractProviderId(String token) {
        String providerIdStr = extractClaim(token, claims -> claims.get("provider_id", String.class));
        return UUID.fromString(providerIdStr);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public String extractSpecialization(String token) {
        return extractClaim(token, claims -> claims.get("specialization", String.class));
    }

    public String extractVerificationStatus(String token) {
        return extractClaim(token, claims -> claims.get("verification_status", String.class));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public boolean isTokenExpired(String token) {
        try {
            Date expiration = extractExpiration(token);
            return expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    private <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public long getExpirationTime() {
        return jwtConfig.getExpiration();
    }
} 