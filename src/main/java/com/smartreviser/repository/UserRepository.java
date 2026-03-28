package com.smartreviser.repository;

import com.smartreviser.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository Interface for User Entity.
 * Contract: SmartReviser2.pdf - Member 1 Specification
 * Extends: JpaRepository<User, Long>
 * Methods: findByEmail, findByUsername
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by email address.
     * Used for login authentication.
     * 
     * @param email User's email address
     * @return Optional<User> - Empty if user not found
     */
    Optional<User> findByEmail(String email);

    /**
     * Find user by username.
     * Used for username uniqueness validation.
     * 
     * @param username User's username
     * @return Optional<User> - Empty if user not found
     */
    Optional<User> findByUsername(String username);
}