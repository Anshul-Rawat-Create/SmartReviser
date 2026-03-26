package com.smartreviser.controller;

import com.smartreviser.dto.EvaluationResultDTO;
import com.smartreviser.dto.QuestionDTO;
import com.smartreviser.dto.SubmissionRequest;
import com.smartreviser.service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluation")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    /**
     * Submit an answer for evaluation
     * Contract: POST /api/evaluation/submit
     * Input: SubmissionRequest (questionId, answer, userId)
     * Output: 200 OK + EvaluationResultDTO
     * Note: Service compares userAnswer with Question.correctAnswer internally
     */
    @PostMapping("/submit")
    public ResponseEntity<EvaluationResultDTO> submitAnswer(@RequestBody SubmissionRequest submission) {
        // Ensure userId is passed to service as per SmartReviser2.pdf Service Spec
        EvaluationResultDTO result = evaluationService.submitAnswer(
                submission.getQuestionId(), 
                submission.getAnswer(), 
                submission.getUserId()
        );
        return ResponseEntity.ok(result);
    }

    /**
     * Get daily questions for a user
     * Contract: GET /api/evaluation/daily/{userId}
     * Input: PathVariable userId
     * Output: 200 OK + List<QuestionDTO>
     */
    @GetMapping("/daily/{userId}")
    public ResponseEntity<List<QuestionDTO>> getDailyQuestions(@PathVariable Long userId) {
        List<QuestionDTO> dailyQuestions = evaluationService.getDailyQuestions(userId);
        return ResponseEntity.ok(dailyQuestions);
    }
}