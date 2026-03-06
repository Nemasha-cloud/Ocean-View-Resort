package com.beachresort.repositories;

import com.beachresort.models.Bill;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BillRepository extends MongoRepository<Bill, String> {
    List<Bill> findByUserId(String userId);
}
