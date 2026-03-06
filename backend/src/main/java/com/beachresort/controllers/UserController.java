package com.beachresort.controllers;

import com.beachresort.models.User;
import com.beachresort.repositories.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "Admin User Operations")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    @Operation(summary = "Get all system users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete/Deactivate a user account")
    public void deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
    }
}
