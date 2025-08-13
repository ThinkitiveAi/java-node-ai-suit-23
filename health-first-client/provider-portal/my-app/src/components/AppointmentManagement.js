import React, { useState } from 'react';
import { Box } from '@mui/material';
import AppointmentList from './AppointmentList';
import PatientAppointmentScheduling from './PatientAppointmentScheduling';

const AppointmentManagement = () => {
  const [schedulingDialogOpen, setSchedulingDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);

  // Handle opening new appointment scheduling
  const handleScheduleNew = () => {
    setEditingAppointment(null);
    setSchedulingDialogOpen(true);
  };

  // Handle editing existing appointment
  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setSchedulingDialogOpen(true);
  };

  // Handle closing scheduling dialog
  const handleCloseScheduling = () => {
    setSchedulingDialogOpen(false);
    setEditingAppointment(null);
  };

  // Handle saving appointment (new or updated)
  const handleSaveAppointment = (appointmentData) => {
    if (editingAppointment) {
      // Update existing appointment
      setAppointments(prev => 
        prev.map(apt => apt.id === appointmentData.id ? appointmentData : apt)
      );
    } else {
      // Add new appointment
      setAppointments(prev => [appointmentData, ...prev]);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f3f3f3', minHeight: '100vh' }}>
      <AppointmentList
        onScheduleNew={handleScheduleNew}
        onEditAppointment={handleEditAppointment}
        appointments={appointments}
      />
      
      <PatientAppointmentScheduling
        open={schedulingDialogOpen}
        onClose={handleCloseScheduling}
        onSave={handleSaveAppointment}
        editingAppointment={editingAppointment}
      />
    </Box>
  );
};

export default AppointmentManagement;
