package com.example.wedsite.service;

import com.example.wedsite.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface AdminService {

    Page<UserDto> getAllUsers(Pageable pageable);
    void deleteUserById(Long id);
    Set<UserDto> getAgreesUsers(Pageable pageable);

    int countAgreesUsers(Pageable pageable);

}
