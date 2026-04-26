package com.example.wedsite.controller;

import com.example.wedsite.dto.UserDto;
import com.example.wedsite.entity.User;
import com.example.wedsite.repository.UserRepository;
import com.example.wedsite.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
     private AdminService adminService;

     @GetMapping("/users")
    public Page<UserDto> getAllUsers(@PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable){
         return adminService.getAllUsers(pageable);
     }
}
