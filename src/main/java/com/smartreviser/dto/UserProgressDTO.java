package com.smartreviser.dto;

import lombok.Data;
import java.util.List;

/**
 * Data Transfer Object for User Progress Analytics.
 * Contract: SmartReviser2.pdf - Member 4 Specification
 * Purpose: Displays weak/strong topics and accuracy.
 */
@Data
public class UserProgressDTO {
    private List<String> weakTopics;
    private List<String> strongTopics;
    private Integer accuracy;
}