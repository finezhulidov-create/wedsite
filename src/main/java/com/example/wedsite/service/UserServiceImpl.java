package com.example.wedsite.service;

import com.example.wedsite.dto.AnswerRequestDto;
import com.example.wedsite.dto.UserDto;
import com.example.wedsite.entity.User;
import com.example.wedsite.repository.UserRepository;
import com.example.wedsite.util.Mapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private  final Mapper mapper;

    @Override
    @Transactional
    public void submit(AnswerRequestDto responseDto) {
        User user = User.builder()
                .username(responseDto.username())
                .answers(responseDto.answers())
                .build();
        userRepository.save(user);
    }

    public UserDto getUser(AnswerRequestDto requestDto){
        User user = userRepository.findById(requestDto.id())
                .orElseThrow();
        return mapper.toDTO(user);
    }

    public void createUser(AnswerRequestDto requestDto){
        User user = User.builder()
                .id(requestDto.id())
                .answers(requestDto.answers())
                .username(requestDto.username())
                .build();
        userRepository.save(user);

    }
}
