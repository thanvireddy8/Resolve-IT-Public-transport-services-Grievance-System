package com.resolveit.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.resolveit.backend.entity.Notification;
import com.resolveit.backend.repository.NotificationRepository;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public List<Notification> getNotificationsByUser(@RequestParam(required = false) Long userId,
                                                    @RequestParam(required = false) String role,
                                                    @RequestParam(required = false) String departmentName) {
        if (userId != null) {
            return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } else if (role != null) {
            return notificationRepository.findByUserRoleOrderByCreatedAtDesc(role);
        } else if (departmentName != null) {
            return notificationRepository.findByUserDepartmentNameOrderByCreatedAtDesc(departmentName);
        } else {
            return List.of();
        }
    }
}
