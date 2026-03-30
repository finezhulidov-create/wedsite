package com.example.wedsite.util;


import com.example.wedsite.dto.UserDto;
import com.example.wedsite.entity.User;
import org.springframework.stereotype.Component;

@Component
public class Mapper {
    public  UserDto toDTO(User user) {
        if (user == null) return null;
        return new UserDto(
                user.getUsername(),
                user.getAnswers()
        );
    }

}
