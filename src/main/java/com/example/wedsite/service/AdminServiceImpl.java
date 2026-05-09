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

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService{

    private final UserRepository userRepository;
    private final Mapper mapper;

    private final UserService userService;

    @Override
    public Page<UserDto> getAllUsers(Pageable pageable) {

        return userRepository.findAll(pageable).map(mapper::toDTO);
    }

    @Override
    public void deleteUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow();
        userRepository.delete(user);
    }

    public Set<UserDto> getAgreesUsers(Pageable pageable){
        Set<UserDto> allUsers = userRepository.findAll(pageable).stream().map(mapper::toDTO).collect(Collectors.toSet());

        return filterAgreesUsers(allUsers);
    }

    @Override
    public int countAgreesUsers(Pageable pageable) {
        List<UserDto> allUsers = userRepository.findAll(pageable).stream().map(mapper::toDTO).toList();
        Set<UserDto> agreesUsers = filterAgreesUsers(new HashSet<>(allUsers));
        return agreesUsers.size();
    }

    private Set<UserDto> filterAgreesUsers(Set<UserDto> allUsers) {
        String b = allUsers.stream()
                .map(UserDto::answers)
                .filter(answ -> answ != null && !answ.isEmpty())
                .map(answer -> answer.get(0))
                .findFirst()
                .orElse(null);
        Set<UserDto> filtered = new HashSet<>();
        for (UserDto dtos : allUsers){
            if (dtos.answers().get(0).equalsIgnoreCase(b)){
                filtered.add(dtos);
            }
        }
        return filtered;
    }


}
