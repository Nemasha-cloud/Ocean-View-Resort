package com.beachresort.config;

import com.beachresort.models.Room;
import com.beachresort.models.User;
import com.beachresort.repositories.RoomRepository;
import com.beachresort.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Set;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(RoomRepository repository, UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            // Seed Admin User
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@oceanview.com");
                admin.setPassword(encoder.encode("admin123"));
                admin.setRoles(Set.of("ROLE_ADMIN", "ROLE_USER"));
                userRepository.save(admin);
                System.out.println("Admin user created: admin / admin123");
            }

            // Seed Rooms
            if (repository.count() == 0) {
                Room standard = new Room();
                standard.setRoomNumber("101");
                standard.setType("Standard");
                standard.setCapacity(2);
                standard.setPricePerNight(new BigDecimal("120.00"));
                standard.setAvailable(true);
                standard.setImageUrl(
                        "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2");
                repository.save(standard);

                Room deluxe = new Room();
                deluxe.setRoomNumber("201");
                deluxe.setType("Deluxe");
                deluxe.setCapacity(3);
                deluxe.setPricePerNight(new BigDecimal("210.00"));
                deluxe.setAvailable(true);
                deluxe.setImageUrl(
                        "https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2");
                repository.save(deluxe);

                Room suite = new Room();
                suite.setRoomNumber("301");
                suite.setType("Suite");
                suite.setCapacity(4);
                suite.setPricePerNight(new BigDecimal("350.00"));
                suite.setAvailable(true);
                suite.setImageUrl(
                        "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2");
                repository.save(suite);

                System.out.println("Database seeded with default rooms!");
            }
        };
    }
}
