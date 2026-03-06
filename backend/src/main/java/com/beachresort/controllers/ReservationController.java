package com.beachresort.controllers;

import com.beachresort.models.Reservation;
import com.beachresort.repositories.ReservationRepository;
import com.beachresort.security.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@Tag(name = "Reservations", description = "Reservation Management APIs")
public class ReservationController {

    private final ReservationRepository reservationRepository;

    public ReservationController(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Get reservations: current user's only for customers, all for admin")
    public List<Reservation> getAllReservations() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (isAdmin) {
            return reservationRepository.findAll();
        }
        return reservationRepository.findByUserId(userDetails.getId());
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Create a new reservation")
    public Reservation createReservation(@RequestBody Reservation reservation) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        reservation.setUserId(userDetails.getId());
        reservation.setStatus("CONFIRMED");
        return reservationRepository.save(reservation);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Update an existing reservation")
    public ResponseEntity<Reservation> updateReservation(@PathVariable String id, @RequestBody Reservation updated) {
        return reservationRepository.findById(id).map(reservation -> {
            reservation.setCheckInDate(updated.getCheckInDate());
            reservation.setCheckOutDate(updated.getCheckOutDate());
            reservation.setGuestCount(updated.getGuestCount());
            reservation.setRoomType(updated.getRoomType());
            return ResponseEntity.ok(reservationRepository.save(reservation));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Cancel a reservation")
    public ResponseEntity<?> deleteReservation(@PathVariable String id) {
        return reservationRepository.findById(id).map(reservation -> {
            reservation.setStatus("CANCELLED");
            reservationRepository.save(reservation);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update reservation status (Admin Only)")
    public ResponseEntity<Reservation> updateReservationStatus(@PathVariable String id, @RequestParam String status) {
        return reservationRepository.findById(id).map(reservation -> {
            reservation.setStatus(status.toUpperCase());
            return ResponseEntity.ok(reservationRepository.save(reservation));
        }).orElse(ResponseEntity.notFound().build());
    }
}
