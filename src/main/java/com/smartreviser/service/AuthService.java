package com.smartreviser.service;

import com.smartreviser.dto.UserDTO;
import com.smartreviser.exception.ResourceNotFoundException;
import com.smartreviser.model.User;
import com.smartreviser.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Service Class for Authentication Operations.
 * Contract: SmartReviser2.pdf - Member 1 Specification
 * Methods: registerUser, login, getProfile
 * Security: Uses BCrypt for password hashing, JWT for tokens
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // JWT Secret Key (In production, use environment variable)
    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    /**
     * Register a new user.
     * Contract: SmartReviser2.pdf - Method 1
     * Input: UserDTO (username, email, password)
     * Output: UserDTO (id, username, email) - Password excluded
     * 
     * @param dto UserDTO containing registration data
     * @return UserDTO with saved user information (without password)
     * @throws ResourceNotFoundException if registration fails
     */
    public UserDTO registerUser(UserDTO dto) {
        // Check if email already exists
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered: " + dto.getEmail());
        }

        // Check if username already exists
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken: " + dto.getUsername());
        }

        // Create new User entity
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword())); // Hash password
        user.setRole("USER"); // Default role

        // Save to database
        User savedUser = userRepository.save(user);

        // Convert to DTO (password excluded)
        return convertToDTO(savedUser);
    }

    /**
     * Login user and generate JWT token.
     * Contract: SmartReviser2.pdf - Method 2
     * Input: email (String), password (String)
     * Output: String (JWT Token)
     * 
     * @param email User's email address
     * @param password User's password (plain text)
     * @return String JWT Token
     * @throws ResourceNotFoundException if user not found
     * @throws RuntimeException if credentials are invalid
     */
    public String login(String email, String password) {
        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        // Verify password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Generate and return JWT token
        return generateToken(user);
    }

    /**
     * Get user profile by ID.
     * Contract: SmartReviser2.pdf - Method 3
     * Input: id (Long)
     * Output: UserDTO (id, username, email) - Password excluded
     * 
     * @param id User's unique identifier
     * @return UserDTO with user information (without password)
     * @throws ResourceNotFoundException if user not found
     */
    public UserDTO getProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        return convertToDTO(user);
    }

    /**
     * Convert User Entity to UserDTO.
     * Security: Password field is intentionally excluded.
     * 
     * @param user User entity
     * @return UserDTO without password
     */
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        // Password is NOT included (security rule from SmartReviser2.pdf)
        return dto;
    }

    /**
     * Generate JWT Token for authenticated user.
     * Token expires in 10 hours.
     * 
     * @param user User entity
     * @return String JWT Token
     */
    private String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("username", user.getUsername());
        claims.put("role", user.getRole());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(secretKey)
                .compact();
    }
}