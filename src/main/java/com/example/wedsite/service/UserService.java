package com.example.wedsite.service;

import com.example.wedsite.dto.AnswerRequestDto;
import com.example.wedsite.dto.UserDto;

public interface UserService {
    void submit(AnswerRequestDto responseDto);
    UserDto getUser(AnswerRequestDto requestDto);
    void createUser(AnswerRequestDto requestDto);
}
