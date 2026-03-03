package com.wellnest.service;

import com.wellnest.model.Appointment;
import com.wellnest.model.Role;
import com.wellnest.model.User;
import com.wellnest.repository.AppointmentRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public Appointment createAppointment(Long patientId, Long doctorId, Appointment appointment) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (patient.getRole() != Role.PATIENT) {
            throw new RuntimeException("Invalid Patient ID");
        }
        if (doctor.getRole() != Role.DOCTOR) {
            throw new RuntimeException("Invalid Doctor ID");
        }

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setStatus("SCHEDULED");
        
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsForPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsForDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }
}
