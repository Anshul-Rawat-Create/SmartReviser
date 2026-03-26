package com.smartreviser.dto;

import lombok.Data;

/**
 * Data Transfer Object for User information.
 * Contract: SmartReviser2.pdf - Member 1 Specification
 * Security: Password field is intentionally excluded.
 */
@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    // Password is excluded for security as per contract
}