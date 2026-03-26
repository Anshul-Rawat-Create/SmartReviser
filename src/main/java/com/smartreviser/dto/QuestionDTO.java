package com.smartreviser.dto;

import lombok.Data;
import java.util.List;

/**
 * Data Transfer Object for Question information.
 * Contract: SmartReviser2.pdf - Member 2 Specification
 * Security: correctAnswer field is intentionally excluded for practice mode.
 */
@Data
public class QuestionDTO {
    private Long id;
    private String questionText;
    private List<String> options;
    private String topic;
    private String difficulty;
    private String language;
    // correctAnswer is excluded for security as per contract
}