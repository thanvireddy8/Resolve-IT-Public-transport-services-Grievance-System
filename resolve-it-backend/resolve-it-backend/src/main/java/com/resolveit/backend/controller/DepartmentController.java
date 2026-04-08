package com.resolveit.backend.controller;

import com.resolveit.backend.entity.Complaint;
import com.resolveit.backend.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DepartmentController {
    @Autowired
    private ComplaintRepository complaintRepo;

    @GetMapping("/complaints/department/{name}")
    public List<Complaint> getComplaintsByDepartment(@PathVariable String name) {
        return complaintRepo.findByAssignedDepartment(name);
    }

    @PutMapping("/complaint/update-status")
    public Complaint updateStatus(@RequestBody Map<String, Object> payload) {
        Long id = Long.valueOf(payload.get("id").toString());
        String status = payload.get("status").toString();
        Complaint c = complaintRepo.findById(id).orElseThrow();
        c.setStatus(status);
        if ("Resolved".equals(status)) {
            c.setResolutionDate(LocalDateTime.now());
        }
        return complaintRepo.save(c);
    }

    @PutMapping("/complaint/respond")
    public Complaint addResponse(@RequestBody Map<String, Object> payload) {
        Long id = Long.valueOf(payload.get("id").toString());
        String response = payload.get("response").toString();
        Complaint c = complaintRepo.findById(id).orElseThrow();
        c.setResponse(response);
        return complaintRepo.save(c);
    }
}
