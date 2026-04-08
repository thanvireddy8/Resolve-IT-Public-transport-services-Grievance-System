package com.resolveit.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.resolveit.backend.entity.User;
import com.resolveit.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/deleteByEmail")
    public org.springframework.http.ResponseEntity<?> deleteUserByEmail(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            userRepository.delete(userOpt.get());
            return org.springframework.http.ResponseEntity.ok("User deleted: " + email);
        } else {
            return org.springframework.http.ResponseEntity.status(404).body("User not found: " + email);
        }
    }

    @PostMapping("/login")
    public org.springframework.http.ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());
        if (user.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {
            return org.springframework.http.ResponseEntity.ok(user.get());
        }
        return org.springframework.http.ResponseEntity.status(401).body("Invalid email or password");
    }

    @PostMapping("/register")
    public org.springframework.http.ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return org.springframework.http.ResponseEntity.status(409).body("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Allow 'user', 'admin', or 'department' as valid roles (all lowercase)
        String inputRole = user.getRole();
        if (inputRole == null || inputRole.trim().isEmpty()) {
            user.setRole("user");
        } else if (inputRole.equalsIgnoreCase("admin")) {
            user.setRole("admin");
        } else if (inputRole.equalsIgnoreCase("department")) {
            user.setRole("department");
        } else {
            user.setRole("user");
        }
        return org.springframework.http.ResponseEntity.ok(userRepository.save(user));
    }

    @GetMapping("/all")
    public List<User> getAllUsers(@RequestParam String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || !user.getRole().equalsIgnoreCase("admin")) {
            throw new RuntimeException("Forbidden: Only admins can access all users");
        }
        return userRepository.findAll();
    }

    @GetMapping("/role")
    public List<User> getUsersByRole(@RequestParam String role) {
        return userRepository.findAll().stream()
                .filter(user -> role.equals(user.getRole()))
                .toList();
    }

    public static class LoginRequest {
        private String name;
        private String email;
        private String password;
        private String role;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
    // DTO for update request
    public static class UpdateProfileRequest {
        private Long id;
        private String name;
        private String currentPassword;
        private String newPassword;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    @PostMapping("/update")
    public org.springframework.http.ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest req) {
        if (req.getId() == null) {
            return org.springframework.http.ResponseEntity.badRequest().body("User ID required");
        }
        Optional<User> userOpt = userRepository.findById(req.getId());
        if (userOpt.isEmpty()) {
            return org.springframework.http.ResponseEntity.status(404).body("User not found");
        }
        User user = userOpt.get();
        // If password change is requested, verify current password
        if (req.getNewPassword() != null && !req.getNewPassword().isBlank()) {
            if (req.getCurrentPassword() == null || !passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
                return org.springframework.http.ResponseEntity.status(401).body("Current password incorrect");
            }
            user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        }
        // Update name if changed
        if (req.getName() != null && !req.getName().isBlank() && !req.getName().equals(user.getName())) {
            user.setName(req.getName());
        }
        userRepository.save(user);
        return org.springframework.http.ResponseEntity.ok("Profile updated");
    }

}