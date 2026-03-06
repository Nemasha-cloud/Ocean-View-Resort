package com.beachresort.repositories;

import com.beachresort.models.GalleryImage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GalleryImageRepository extends MongoRepository<GalleryImage, String> {

    List<GalleryImage> findAllByOrderByCreatedAtDesc();
}
