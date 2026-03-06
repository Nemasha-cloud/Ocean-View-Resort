package com.beachresort.controllers;

import com.beachresort.models.ContactMessage;
import com.beachresort.repositories.ContactMessageRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/contact")
@Tag(name = "Contact", description = "Contact form and messages")
public class ContactController {

    private final ContactMessageRepository contactMessageRepository;

    public ContactController(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    @PostMapping
    @Operation(summary = "Submit contact form (public)")
    public ResponseEntity<ContactMessage> submitContact(@RequestBody ContactMessage message) {
        message.setCreatedAt(Instant.now());
        ContactMessage saved = contactMessageRepository.save(message);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all contact messages (admin only)")
    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc();
    }
}
