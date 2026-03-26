package com.smartreviser.controller;

import com.smartreviser.dto.QuestionDTO;
import com.smartreviser.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    /**
     * Get all questions or filter by topic/difficulty
     * Contract: GET /api/questions/
     * Input: Optional Query Params (topic, difficulty)
     * Output: 200 OK + List<QuestionDTO>
     * Note: QuestionDTO must NOT contain correctAnswer (handled in Service)
     */
    @GetMapping
    public ResponseEntity<List<QuestionDTO>> getAllQuestions(
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String difficulty) {
        
        List<QuestionDTO> questions;
        
        // Logic to delegate to specific service methods based on params
        if (topic != null && !topic.isEmpty()) {
            questions = questionService.findByTopic(topic);
        } else if (difficulty != null && !difficulty.isEmpty()) {
            questions = questionService.findByDifficulty(difficulty);
        } else {
            questions = questionService.getAllQuestions();
        }
        
        return ResponseEntity.ok(questions);
    }

    /**
     * Get single question by ID (Optional helper endpoint)
     */
    @GetMapping("/{id}")
    public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable Long id) {
        QuestionDTO questionDTO = questionService.getQuestionById(id);
        return ResponseEntity.ok(questionDTO);
    }
}