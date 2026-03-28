package com.smartreviser.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attempts")
public class Attempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long questionId;

    private String submittedAnswer;

    private boolean correct;

    private int score;

    private LocalDateTime submittedAt;

    public Attempt() {
        this.submittedAt = LocalDateTime.now();
    }

    public Attempt(Long userId, Long questionId, String submittedAnswer, boolean correct, int score) {
        this.userId = userId;
        this.questionId = questionId;
        this.submittedAnswer = submittedAnswer;
        this.correct = correct;
        this.score = score;
        this.submittedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public Long getUserId() { return userId; }

    public Long getQuestionId() { return questionId; }

    public String getSubmittedAnswer() { return submittedAnswer; }

    public boolean isCorrect() { return correct; }

    public int getScore() { return score; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }

    public void setUserId(Long userId) { this.userId = userId; }

    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public void setSubmittedAnswer(String submittedAnswer) { this.submittedAnswer = submittedAnswer; }

    public void setCorrect(boolean correct) { this.correct = correct; }

    public void setScore(int score) { this.score = score; }
}
