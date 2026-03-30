package com.example.wedsite.controller;

import com.example.wedsite.dto.AnswerRequestDto;
import com.example.wedsite.dto.UserDto;
import com.example.wedsite.service.UserService;
import com.example.wedsite.util.Mapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/submit")
public class UserAnswersController {
        private final UserService userService;
        private final Mapper mapper;

        @PostMapping
    public ResponseEntity<Void> submit(@RequestBody AnswerRequestDto requestDto){
            userService.submit(requestDto);
            return ResponseEntity.noContent().build();
        }

    @GetMapping("/user")
    public ResponseEntity<UserDto> getUser(@RequestBody AnswerRequestDto requestDto){
       UserDto user = userService.getUser(requestDto);
            return ResponseEntity.ok(user);
    }

    @PostMapping("/user/add")
    public ResponseEntity<Void> createUser(@RequestBody AnswerRequestDto requestDto){
            userService.createUser(requestDto);
            return ResponseEntity.status(HttpStatus.OK).build();
    }
}

