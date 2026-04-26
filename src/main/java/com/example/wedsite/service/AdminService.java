package com.example.wedsite.service;

import com.example.wedsite.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {

    Page<UserDto> getAllUsers(Pageable pageable);
}
