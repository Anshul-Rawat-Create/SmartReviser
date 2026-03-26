package com.smartreviser.controller;

import com.smartreviser.dto.LoginRequest;
import com.smartreviser.dto.UserDTO;
import com.smartreviser.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Register a new user
     * Contract: POST /api/auth/register
     * Input: UserDTO (username, email, password)
     * Output: 201 Created + UserDTO
     */
    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@RequestBody UserDTO userDTO) {
        UserDTO registeredUser = authService.registerUser(userDTO);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    /**
     * Login user
     * Contract: POST /api/auth/login
     * Input: LoginRequest (email, password)
     * Output: 200 OK + String (Token)
     */
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginRequest loginRequest) {
        String token = authService.login(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(token);
    }

    /**
     * Get user profile
     * Contract: GET /api/auth/profile/{id}
     * Input: PathVariable id
     * Output: 200 OK + UserDTO
     */
    @GetMapping("/profile/{id}")
    public ResponseEntity<UserDTO> getUserProfile(@PathVariable Long id) {
        UserDTO userDTO = authService.getProfile(id);
        return ResponseEntity.ok(userDTO);
    }
}