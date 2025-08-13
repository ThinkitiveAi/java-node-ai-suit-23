package com.healthfirst.server.service;

import com.healthfirst.server.entity.Provider;
import com.healthfirst.server.repository.ProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private ProviderRepository providerRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Provider provider = providerRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Provider not found with email: " + email));

        return User.builder()
                .username(provider.getEmail())
                .password(provider.getPasswordHash())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_PROVIDER")))
                .accountExpired(false)
                .accountLocked(!provider.getIsActive())
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
} 