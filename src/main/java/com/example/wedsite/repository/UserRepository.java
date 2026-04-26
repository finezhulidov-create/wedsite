package com.example.wedsite.repository;

import com.example.wedsite.dto.UserDto;
import com.example.wedsite.entity.User;
import jakarta.validation.constraints.NotNull;
import jdk.jfr.Registered;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    @Override
    @NonNull
    Page<User> findAll(@NonNull Pageable pageable);
}