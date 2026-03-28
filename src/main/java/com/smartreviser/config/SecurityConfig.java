package com.smartreviser.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Security Configuration for Smart Reviser Application.
 * Contract: SmartReviser2.pdf - Member 1 Specification
 * Responsibilities:
 * 1. Configure BCrypt PasswordEncoder for secure password hashing
 * 2. Configure CORS settings for frontend-backend communication
 * 3. Define security filter chain with public/protected endpoints
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Configure BCrypt PasswordEncoder bean.
     * This is used by AuthService for password hashing during registration
     * and password verification during login.
     * 
     * @return PasswordEncoder instance (BCrypt)
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configure Security Filter Chain.
     * Defines which endpoints are public and which require authentication.
     * 
     * @param http HttpSecurity object for configuration
     * @return SecurityFilterChain configured instance
     * @throws Exception if configuration fails
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Enable CORS configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Disable CSRF for stateless API (using JWT tokens instead)
            .csrf(csrf -> csrf.disable())
            
            // Configure authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - no authentication required
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/").permitAll()
                .requestMatchers("/static/**").permitAll()
                .requestMatchers("/html/**").permitAll()
                .requestMatchers("/css/**").permitAll()
                .requestMatchers("/js/**").permitAll()
                
                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            
            // Configure session management (stateless for JWT)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS)
            );
        
        return http.build();
    }

    /**
     * Configure CORS (Cross-Origin Resource Sharing) settings.
     * Allows frontend to make requests to backend API from different origin.
     * 
     * @return CorsConfigurationSource configured instance
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allowed origins (add production URL when deploying)
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:8080",
            "http://127.0.0.1:8080"
        ));
        
        // Allowed HTTP methods
        configuration.setAllowedMethods(Arrays.asList(
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS",
            "PATCH"
        ));
        
        // Allowed headers
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        // Exposed headers (for frontend to access)
        configuration.setExposedHeaders(Arrays.asList(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials"
        ));
        
        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);
        
        // Max age for preflight cache (in seconds)
        configuration.setMaxAge(3600L);
        
        // Apply configuration to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}