package com.smartreviser.service;

import com.smartreviser.model.Attempt;
import com.smartreviser.model.Question;
import com.smartreviser.repository.AttemptRepository;
import com.smartreviser.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EvaluationService {

    @Autowired
    private AttemptRepository attemptRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public Attempt evaluateAnswer(Long userId, Long questionId, String submittedAnswer) {

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        boolean correct = question.getCorrectAnswer().equalsIgnoreCase(submittedAnswer);

        int score = correct ? question.getMarks() : 0;

        Attempt attempt = new Attempt(userId, questionId, submittedAnswer, correct, score);

        return attemptRepository.save(attempt);
    }
}