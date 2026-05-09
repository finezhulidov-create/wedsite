package com.example.wedsite.service;

import com.example.wedsite.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminService {

    Page<UserDto> getAllUsers(Pageable pageable);
    void deleteUserById(Long id);
    List<UserDto> getAgreesUsers(Pageable pageable);

}
