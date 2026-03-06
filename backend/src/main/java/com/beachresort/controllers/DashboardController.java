package com.beachresort.controllers;

import com.beachresort.repositories.ReservationRepository;
import com.beachresort.repositories.RoomRepository;
import com.beachresort.repositories.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Admin Dashboard Statistics")
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public DashboardController(ReservationRepository reservationRepository,
            RoomRepository roomRepository,
            UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    @Operation(summary = "Get top-level dashboard statistics")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalReservations = reservationRepository.count();
        long totalRooms = roomRepository.count();
        long availableRooms = roomRepository.findAll().stream().filter(r -> r.isAvailable()).count();
        long totalGuests = userRepository.count(); // Approximate as total users for now

        stats.put("totalReservations", totalReservations);
        stats.put("totalRooms", totalRooms);
        stats.put("availableRooms", availableRooms);
        stats.put("occupiedRooms", totalRooms - availableRooms);
        stats.put("totalGuests", totalGuests);

        // Mock revenue/trends for assignment visualization
        stats.put("todayRevenue", 450.00);
        stats.put("monthlyRevenue", 12400.00);
        stats.put("todayCheckins", 5);
        stats.put("todayCheckouts", 3);

        return stats;
    }
}
