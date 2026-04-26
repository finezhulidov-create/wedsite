package com.example.wedsite.service;

import com.example.wedsite.dto.AnswerRequestDto;
import com.example.wedsite.dto.UserDto;
import com.example.wedsite.entity.User;
import com.example.wedsite.repository.UserRepository;
import com.example.wedsite.util.Mapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.embedded.undertow.UndertowServletWebServerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService{

    private final UserRepository userRepository;
    private final Mapper mapper;



    @Override
    public Page<UserDto> getAllUsers(Pageable pageable) {

        return userRepository.findAll(pageable).map(mapper::toDTO);
    }
}
