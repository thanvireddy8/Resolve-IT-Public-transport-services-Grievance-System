package com.resolveit.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.resolveit.backend.entity.Complaint;
import com.resolveit.backend.entity.User;
import com.resolveit.backend.repository.ComplaintRepository;
import com.resolveit.backend.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) throws Exception {
        // Create sample users
        if (userRepository.count() == 0) {
            User admin = new User("Admin User", "admin@example.com", passwordEncoder.encode("password123"), "admin", null);
            User user1 = new User("John Doe", "user@example.com", passwordEncoder.encode("password123"), "user", null);
            User user2 = new User("Jane Smith", "jane@example.com", passwordEncoder.encode("password123"), "user", null);

            userRepository.save(admin);
            userRepository.save(user1);
            userRepository.save(user2);

            // Create sample complaints
            Complaint complaint1 = new Complaint();
            complaint1.setUserId(user1.getId());
            complaint1.setCategory("Bus Service");
            complaint1.setSubject("Delayed Bus Route 42");
            complaint1.setDescription("The bus was delayed by 45 minutes without any prior notification.");
            complaint1.setStatus("Pending");
            complaint1.setDate(java.time.LocalDateTime.now().minusDays(3));

            Complaint complaint2 = new Complaint();
            complaint2.setUserId(user2.getId());
            complaint2.setCategory("Infrastructure");
            complaint2.setSubject("Broken Seat in Metro Train");
            complaint2.setDescription("Seat number 12 in coach B of the Blue Line metro is broken.");
            complaint2.setStatus("In Progress");
            complaint2.setDate(java.time.LocalDateTime.now().minusDays(2));

            Complaint complaint3 = new Complaint();
            complaint3.setUserId(user1.getId());
            complaint3.setCategory("Staff Behavior");
            complaint3.setSubject("Rude conductor");
            complaint3.setDescription("The conductor on bus 102 was very rude when I asked for change.");
            complaint3.setStatus("Resolved");
            complaint3.setDate(java.time.LocalDateTime.now().minusDays(5));
            // complaint3.setDepartmentMessage("Issue has been addressed with the conductor.");
            // complaint3.setDepartmentResolutionStatus("Resolved");

            complaintRepository.save(complaint1);
            complaintRepository.save(complaint2);
            complaintRepository.save(complaint3);
        }
    }
}