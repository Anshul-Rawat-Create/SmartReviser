package com.smartreviser.controller;

import com.smartreviser.dto.LeaderboardDTO;
import com.smartreviser.dto.UserProgressDTO;
import com.smartreviser.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    /**
     * Get user progress (Weak/Strong topics)
     * Contract: GET /api/analytics/progress/{userId}
     * Input: PathVariable userId
     * Output: 200 OK + UserProgressDTO
     */
    @GetMapping("/progress/{userId}")
    public ResponseEntity<UserProgressDTO> getUserProgress(@PathVariable Long userId) {
        UserProgressDTO progress = analyticsService.getProgress(userId);
        return ResponseEntity.ok(progress);
    }

    /**
     * Get global leaderboard
     * Contract: GET /api/analytics/leaderboard
     * Input: None
     * Output: 200 OK + List<LeaderboardDTO>
     * Note: Service must sort users by totalScore descending
     */
    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardDTO>> getLeaderboard() {
        List<LeaderboardDTO> leaderboard = analyticsService.getLeaderboard();
        return ResponseEntity.ok(leaderboard);
    }
}