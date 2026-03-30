package com.example.wedsite.dto;

import com.example.wedsite.entity.User;

import java.util.List;

/**
 * DTO for {@link User}
 */
public record UserDto(String username, List<String> answers) {
}