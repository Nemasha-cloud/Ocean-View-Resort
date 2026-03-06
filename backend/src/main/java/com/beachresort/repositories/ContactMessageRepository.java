package com.beachresort.repositories;

import com.beachresort.models.ContactMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ContactMessageRepository extends MongoRepository<ContactMessage, String> {
    List<ContactMessage> findAllByOrderByCreatedAtDesc();
}
