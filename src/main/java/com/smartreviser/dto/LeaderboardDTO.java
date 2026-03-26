package com.smartreviser.dto;

import lombok.Data;

/**
 * Data Transfer Object for Leaderboard Entries.
 * Contract: SmartReviser2.pdf - Member 4 Specification
 * Purpose: Displays username, totalScore, and rank.
 */
@Data
public class LeaderboardDTO {
    private String username;
    private Integer totalScore;
    private Integer rank;
}