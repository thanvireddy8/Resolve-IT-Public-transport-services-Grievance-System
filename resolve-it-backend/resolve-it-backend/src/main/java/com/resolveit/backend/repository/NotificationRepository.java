package com.resolveit.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resolveit.backend.entity.Notification;
import com.resolveit.backend.entity.User;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser(User user);
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Find notifications for users with a specific role
    List<Notification> findByUserRoleOrderByCreatedAtDesc(String role);

    // Find notifications for users in a specific department
    List<Notification> findByUserDepartmentNameOrderByCreatedAtDesc(String departmentName);
}
