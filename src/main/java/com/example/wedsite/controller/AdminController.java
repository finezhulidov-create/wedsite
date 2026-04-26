package com.example.wedsite.controller;

import com.example.wedsite.dto.UserDto;
import com.example.wedsite.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Scope;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
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
