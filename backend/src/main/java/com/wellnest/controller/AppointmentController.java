package com.wellnest.controller;

import com.wellnest.model.Appointment;
import com.wellnest.model.User;
import com.wellnest.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // Receptionist creates appointments
    @PostMapping("/receptionist/appointments")
    public ResponseEntity<Appointment> createAppointment(@RequestParam Long patientId,
            @RequestParam Long doctorId,
            @RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.createAppointment(patientId, doctorId, appointment));
    }

    // Patient views their own appointments
    @GetMapping("/patient/appointments")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(appointmentService.getAppointmentsForPatient(user.getId()));
    }

    // Doctor views their appointments
    @GetMapping("/doctor/appointments")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(appointmentService.getAppointmentsForDoctor(user.getId()));
    }
}
