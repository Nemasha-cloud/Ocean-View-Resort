package com.beachresort.controllers;

import com.beachresort.models.GalleryImage;
import com.beachresort.repositories.GalleryImageRepository;
import com.beachresort.security.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@Tag(name = "Gallery", description = "Gallery Management APIs")
public class GalleryController {

    private final GalleryImageRepository galleryImageRepository;

    public GalleryController(GalleryImageRepository galleryImageRepository) {
        this.galleryImageRepository = galleryImageRepository;
    }

    @GetMapping
    @Operation(summary = "Get all gallery images")
    public List<GalleryImage> getAllImages() {
        return galleryImageRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add gallery image (Admin Only)")
    public GalleryImage addImage(@RequestBody GalleryImage image) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth != null && auth.getPrincipal() instanceof UserDetailsImpl
                ? ((UserDetailsImpl) auth.getPrincipal()).getUsername()
                : "admin";

        image.setCreatedAt(LocalDateTime.now());
        image.setCreatedBy(username);
        if (image.getCaption() == null) {
            image.setCaption("");
        }
        return galleryImageRepository.save(image);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete gallery image (Admin Only)")
    public void deleteImage(@PathVariable String id) {
        galleryImageRepository.deleteById(id);
    }
}
