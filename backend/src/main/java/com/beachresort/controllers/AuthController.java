package com.beachresort.controllers;

import com.beachresort.models.User;
import com.beachresort.repositories.UserRepository;
import com.beachresort.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;
import java.util.Set;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;
import com.beachresort.security.UserDetailsImpl;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Login and Registration APIs")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
            PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and get token")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.get("username"), loginRequest.get("password")));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "token", jwt,
                "username", userDetails.getUsername(),
                "roles", roles));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.get("username"))) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        User user = new User();
        user.setUsername(signUpRequest.get("username"));
        user.setEmail(signUpRequest.get("email"));
        user.setPassword(encoder.encode(signUpRequest.get("password")));
        user.setFullName(signUpRequest.get("fullName"));
        user.setAddress(signUpRequest.get("address"));
        user.setContactNumber(signUpRequest.get("contactNumber"));
        user.setRoles(Set.of("ROLE_USER"));

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}
