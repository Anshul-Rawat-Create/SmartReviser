package com.smartreviser.dto;

import lombok.Data;

@Data
public class SubmissionRequest {
    private Long questionId;
    private String answer;
    private Long userId; // Required to match EvaluationService signature
}