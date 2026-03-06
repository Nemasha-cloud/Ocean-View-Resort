package com.beachresort.repositories;

import com.beachresort.models.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findByUserId(String userId);
}
