package com.example.wedsite.dto;

import java.util.List;

/**
 * DTO for {@link com.example.wedsite.entity.User}
 */
public record AnswerRequestDto(Long id, String username, List<String> answers) {
}