package com.beachresort.controllers;

import com.beachresort.models.Room;
import com.beachresort.repositories.RoomRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@Tag(name = "Rooms", description = "Room Management")
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @GetMapping
    @Operation(summary = "Get all rooms")
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a new room (Admin Only)")
    public Room addRoom(@RequestBody Room room) {
        return roomRepository.save(room);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing room (Admin Only)")
    public Room updateRoom(@PathVariable String id, @RequestBody Room updatedRoom) {
        return roomRepository.findById(id).map(room -> {
            room.setRoomNumber(updatedRoom.getRoomNumber());
            room.setType(updatedRoom.getType());
            room.setCapacity(updatedRoom.getCapacity());
            room.setPricePerNight(updatedRoom.getPricePerNight());
            room.setAvailable(updatedRoom.isAvailable());
            room.setImageUrl(updatedRoom.getImageUrl());
            return roomRepository.save(room);
        }).orElseThrow(() -> new RuntimeException("Room not found with id " + id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a room (Admin Only)")
    public void deleteRoom(@PathVariable String id) {
        roomRepository.deleteById(id);
    }
}
