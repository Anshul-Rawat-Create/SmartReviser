package com.smartreviser.dto;

import lombok.Data;

/**
 * Data Transfer Object for Evaluation Results.
 * Contract: SmartReviser2.pdf - Member 3 Specification
 * Purpose: Returns scoring logic result after answer submission.
 */
@Data
public class EvaluationResultDTO {
    private Boolean isCorrect;
    private Integer score;
    private String message;
}