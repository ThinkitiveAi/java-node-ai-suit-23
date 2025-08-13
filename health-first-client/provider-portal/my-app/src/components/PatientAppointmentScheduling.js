import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Snackbar,

  FormLabel,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import {
  Close,
  CalendarToday,
  Schedule,
  Person,
  MedicalServices,
  AttachMoney,
  LocalHospital,
} from '@mui/icons-material';

const APPOINTMENT_MODES = [
  { value: 'in-person', label: 'In-Person' },
  { value: 'video-call', label: 'Video Call' },
  { value: 'home', label: 'Home' },
];

const APPOINTMENT_TYPES = [
  'New Patient',
  'Follow-up',
  'Consultation',
  'Check-up',
  'Emergency',
  'Routine',
  'Specialist Referral',
];

const MOCK_PATIENTS = [
  { id: 1, name: 'John Doe', dob: '1985-06-15', phone: '202-555-0123' },
  { id: 2, name: 'Jane Smith', dob: '1990-03-22', phone: '202-555-0124' },
  { id: 3, name: 'Robert Johnson', dob: '1978-11-08', phone: '202-555-0125' },
  { id: 4, name: 'Emily Davis', dob: '1995-09-14', phone: '202-555-0126' },
  { id: 5, name: 'Michael Wilson', dob: '1982-01-30', phone: '202-555-0127' },
];

const MOCK_PROVIDERS = [
  { id: 1, name: 'Dr. Sarah Smith', specialty: 'Cardiology' },
  { id: 2, name: 'Dr. Michael Johnson', specialty: 'Dermatology' },
  { id: 3, name: 'Dr. Emily Davis', specialty: 'Pediatrics' },
  { id: 4, name: 'Dr. John Wilson', specialty: 'Orthopedics' },
  { id: 5, name: 'Dr. Lisa Brown', specialty: 'Internal Medicine' },
];

const PatientAppointmentScheduling = ({ open, onClose, onSave, editingAppointment = null }) => {
  
  // Form state
  const [formData, setFormData] = useState({
    patientId: editingAppointment?.patientId || '',
    patientName: editingAppointment?.patientName || '',
    appointmentMode: editingAppointment?.appointmentMode || 'in-person',
    providerId: editingAppointment?.providerId || '',
    providerName: editingAppointment?.providerName || '',
    appointmentType: editingAppointment?.appointmentType || '',
    estimatedAmount: editingAppointment?.estimatedAmount || '',
    appointmentDate: editingAppointment?.appointmentDate || '',
    appointmentTime: editingAppointment?.appointmentTime || '',
    reasonForVisit: editingAppointment?.reasonForVisit || '',
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Generate time slots (15-minute intervals from 9 AM to 5 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === 17 && minute > 0) break; // Stop at 5 PM
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        slots.push({ value: timeString, label: displayTime });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    if (!formData.patientId) {
      newErrors.patientId = 'Patient selection is required';
    }

    if (!formData.appointmentMode) {
      newErrors.appointmentMode = 'Appointment mode is required';
    }

    if (!formData.providerId) {
      newErrors.providerId = 'Provider selection is required';
    }

    if (!formData.appointmentType) {
      newErrors.appointmentType = 'Appointment type is required';
    }

    if (!formData.estimatedAmount) {
      newErrors.estimatedAmount = 'Estimated amount is required';
    } else if (isNaN(formData.estimatedAmount) || parseFloat(formData.estimatedAmount) <= 0) {
      newErrors.estimatedAmount = 'Please enter a valid amount';
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Appointment date is required';
    } else {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.appointmentDate = 'Appointment date cannot be in the past';
      }
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Appointment time is required';
    }

    if (!formData.reasonForVisit.trim()) {
      newErrors.reasonForVisit = 'Reason for visit is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle patient selection
  const handlePatientSelect = (event, patient) => {
    if (patient) {
      setFormData(prev => ({
        ...prev,
        patientId: patient.id,
        patientName: patient.name
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        patientId: '',
        patientName: ''
      }));
    }
  };

  // Handle provider selection
  const handleProviderSelect = (event, provider) => {
    if (provider) {
      setFormData(prev => ({
        ...prev,
        providerId: provider.id,
        providerName: provider.name
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        providerId: '',
        providerName: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fix the validation errors before submitting',
        severity: 'error'
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const appointmentData = {
        ...formData,
        id: editingAppointment?.id || Date.now(),
        status: editingAppointment?.status || 'Scheduled',
        createdDate: editingAppointment?.createdDate || new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };

      onSave(appointmentData);
      
      setSnackbar({
        open: true,
        message: `Appointment ${editingAppointment ? 'updated' : 'scheduled'} successfully!`,
        severity: 'success'
      });

      // Reset form and close dialog
      setTimeout(() => {
        handleClose();
      }, 1500);

      // TODO: Integrate with API
      // const response = await appointmentAPI.create(appointmentData);
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save appointment. Please try again.',
        severity: 'error'
      });
    }
  };

  // Handle dialog close
  const handleClose = () => {
    setFormData({
      patientId: '',
      patientName: '',
      appointmentMode: 'in-person',
      providerId: '',
      providerName: '',
      appointmentType: '',
      estimatedAmount: '',
      appointmentDate: '',
      appointmentTime: '',
      reasonForVisit: '',
    });
    setErrors({});
    onClose();
  };

  // Get today's date in YYYY-MM-DD format for date input min value
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#f8f8f8', 
          borderBottom: '1px solid #ECECEC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2
        }}>
          <Typography variant="h6" sx={{ color: '#393939', fontWeight: 500 }}>
            {editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Patient Selection */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={MOCK_PATIENTS}
                  getOptionLabel={(option) => option.name}
                  value={MOCK_PATIENTS.find(p => p.id === formData.patientId) || null}
                  onChange={handlePatientSelect}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Patient Name"
                      placeholder="Search & Select Patient"
                      error={!!errors.patientId}
                      helperText={errors.patientId}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        DOB: {option.dob} | Phone: {option.phone}
                      </Typography>
                    </Box>
                  )}
                />
              </Grid>

              {/* Appointment Mode */}
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" error={!!errors.appointmentMode}>
                  <FormLabel component="legend" sx={{ mb: 1, color: '#565656', fontSize: '12px', fontWeight: 500 }}>
                    Appointment Mode
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formData.appointmentMode}
                    onChange={(e) => handleInputChange('appointmentMode', e.target.value)}
                    sx={{ gap: 3 }}
                  >
                    {APPOINTMENT_MODES.map((mode) => (
                      <FormControlLabel
                        key={mode.value}
                        value={mode.value}
                        control={<Radio sx={{ '&.Mui-checked': { color: '#233853' } }} />}
                        label={mode.label}
                        sx={{ '& .MuiFormControlLabel-label': { fontSize: '14px' } }}
                      />
                    ))}
                  </RadioGroup>
                  {errors.appointmentMode && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors.appointmentMode}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Provider Selection */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={MOCK_PROVIDERS}
                  getOptionLabel={(option) => option.name}
                  value={MOCK_PROVIDERS.find(p => p.id === formData.providerId) || null}
                  onChange={handleProviderSelect}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Provider"
                      placeholder="Search Provider"
                      error={!!errors.providerId}
                      helperText={errors.providerId}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <MedicalServices sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.specialty}
                      </Typography>
                    </Box>
                  )}
                />
              </Grid>

              {/* Appointment Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.appointmentType}>
                  <InputLabel>Appointment Type</InputLabel>
                  <Select
                    value={formData.appointmentType}
                    onChange={(e) => handleInputChange('appointmentType', e.target.value)}
                    label="Appointment Type"
                  >
                    {APPOINTMENT_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.appointmentType && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.appointmentType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Estimated Amount */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Estimated Amount ($)"
                  placeholder="Enter Amount"
                  value={formData.estimatedAmount}
                  onChange={(e) => handleInputChange('estimatedAmount', e.target.value)}
                  error={!!errors.estimatedAmount}
                  helperText={errors.estimatedAmount}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    type: 'number',
                    min: 0,
                    step: 0.01,
                  }}
                />
              </Grid>

              {/* Date & Time */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date & Time"
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                  error={!!errors.appointmentDate}
                  helperText={errors.appointmentDate}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: getTodayDate() }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Time Selection */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.appointmentTime}>
                  <InputLabel>Appointment Time</InputLabel>
                  <Select
                    value={formData.appointmentTime}
                    onChange={(e) => handleInputChange('appointmentTime', e.target.value)}
                    label="Appointment Time"
                    startAdornment={
                      <InputAdornment position="start">
                        <Schedule sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    }
                  >
                    {timeSlots.map((slot) => (
                      <MenuItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.appointmentTime && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.appointmentTime}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Reason for Visit */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason for Visit"
                  placeholder="Enter Reason"
                  multiline
                  rows={3}
                  value={formData.reasonForVisit}
                  onChange={(e) => handleInputChange('reasonForVisit', e.target.value)}
                  error={!!errors.reasonForVisit}
                  helperText={errors.reasonForVisit}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalHospital sx={{ color: 'text.secondary', mt: -1 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          borderTop: '1px solid #ECECEC',
          p: 2,
          justifyContent: 'flex-end',
          gap: 1
        }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            sx={{ 
              color: '#233853',
              borderColor: '#233853',
              '&:hover': {
                borderColor: '#1a2940',
                bgcolor: 'rgba(35, 56, 83, 0.05)'
              }
            }}
          >
            Close
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            sx={{ 
              bgcolor: '#233853',
              '&:hover': { bgcolor: '#1a2940' }
            }}
          >
            {editingAppointment ? 'Update' : 'Save & Close'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PatientAppointmentScheduling;
