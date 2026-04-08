
package com.resolveit.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.resolveit.backend.entity.Complaint;
import com.resolveit.backend.entity.Notification;
import com.resolveit.backend.entity.User;
import com.resolveit.backend.repository.ComplaintRepository;
import com.resolveit.backend.repository.NotificationRepository;
import com.resolveit.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {
    // ...existing code...

    @PutMapping("/{id}/department-response")
    public Complaint updateDepartmentResponse(@PathVariable Long id, @RequestParam String response) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setResponse(response);
        return complaintRepository.save(complaint);
    }

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/department/{department}/users")
    public List<Complaint> getComplaintsByDepartmentAndUsers(
            @PathVariable String department,
            @RequestParam List<String> userNames) {
        return complaintRepository.findAll()
            .stream()
            .filter(complaint -> department.equalsIgnoreCase(complaint.getAssignedDepartment())
                && complaint.getUserId() != null
                && userRepository.findById(complaint.getUserId())
                    .map(user -> userNames.stream().anyMatch(name -> name.equalsIgnoreCase(user.getName())))
                    .orElse(false))
            .toList();
    }

    @DeleteMapping("/{id}")
    public void deleteComplaint(@PathVariable Long id) {
        complaintRepository.deleteById(id);
    }

    @PutMapping("/{id}/status")
    public Complaint updateComplaintStatus(@PathVariable Long id, @RequestParam String status) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(status);
        Complaint updated = complaintRepository.save(complaint);
        // Notify user for any status update
        if (complaint.getUserId() != null) {
            userRepository.findById(complaint.getUserId()).ifPresent(user -> {
                String message = "Your complaint (ID #" + complaint.getId() + ") status has been updated to '" + status + "'.";
                Notification notif = new Notification(user, message);
                notificationRepository.save(notif);
            });
        }
        return updated;
    }

    @GetMapping("/notifications/user/{userId}")
    public List<Notification> getNotificationsByUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByUser(user);
    }

    @PutMapping("/notifications/{id}/read")
    public Notification markNotificationAsRead(@PathVariable Long id) {
        Notification notif = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notif.setRead(true);
        return notificationRepository.save(notif);
    }

    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Complaint> getComplaintsByUser(@PathVariable Long userId) {
        return complaintRepository.findAll()
            .stream()
            .filter(complaint -> complaint.getUserId() != null && complaint.getUserId().equals(userId))
            .toList();
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public Complaint createComplaint(
        @RequestParam("userId") Long userId,
        @RequestParam("category") String category,
        @RequestParam("subject") String subject,
        @RequestParam("description") String description,
        @RequestPart(value = "attachment", required = false) MultipartFile attachment
    ) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = new Complaint();
        complaint.setUserId(user.getId());
        complaint.setCategory(category);
        complaint.setSubject(subject);
        complaint.setDescription(description);
        complaint.setStatus("Pending");
        complaint.setDate(java.time.LocalDateTime.now());

        // TODO: Save the attachment file if present (e.g., to disk or DB), and store the path in complaint
        // if (attachment != null && !attachment.isEmpty()) {
        //     // Save file logic here
        // }

        Complaint savedComplaint = complaintRepository.save(complaint);
        // Notify user that complaint was raised
        Notification notif = new Notification(user, "Your complaint (ID #" + savedComplaint.getId() + ") has been submitted successfully.");
        notificationRepository.save(notif);
        return savedComplaint;
    }

    @GetMapping("/department/{department}")
    public List<Complaint> getComplaintsByDepartment(@PathVariable String department) {
        return complaintRepository.findAll()
            .stream()
            .filter(complaint -> department.equalsIgnoreCase(complaint.getAssignedDepartment()))
            .toList();
    }

    @PutMapping("/{id}/assign-department")
    public Complaint assignDepartment(@PathVariable Long id, @RequestParam String department) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setAssignedDepartment(department);
        complaint.setStatus("In Progress");
        return complaintRepository.save(complaint);
    }
}