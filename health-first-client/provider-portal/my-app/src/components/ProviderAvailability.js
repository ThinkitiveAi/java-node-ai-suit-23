import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Add,
  Delete,
  Schedule,
  Save,
  Close,
  CalendarToday,
  AccessTime,
  Visibility,
  Edit,
} from '@mui/icons-material';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const TIME_ZONES = [
  'UTC-12:00 - Baker Island',
  'UTC-11:00 - American Samoa',
  'UTC-10:00 - Hawaii',
  'UTC-09:00 - Alaska',
  'UTC-08:00 - Pacific Time',
  'UTC-07:00 - Mountain Time',
  'UTC-06:00 - Central Time',
  'UTC-05:00 - Eastern Time',
  'UTC-04:00 - Atlantic Time',
  'UTC-03:00 - Brasilia Time',
  'UTC-02:00 - Mid-Atlantic',
  'UTC-01:00 - Azores',
  'UTC+00:00 - GMT/UTC',
  'UTC+01:00 - Central European Time',
  'UTC+02:00 - Eastern European Time',
  'UTC+03:00 - Moscow Time',
  'UTC+04:00 - Gulf Time',
  'UTC+05:00 - Pakistan Time',
  'UTC+05:30 - India Standard Time',
  'UTC+06:00 - Bangladesh Time',
  'UTC+07:00 - Indochina Time',
  'UTC+08:00 - China Standard Time',
  'UTC+09:00 - Japan Standard Time',
  'UTC+10:00 - Australian Eastern Time',
  'UTC+11:00 - Solomon Islands Time',
  'UTC+12:00 - New Zealand Time'
];

const ProviderAvailability = () => {
  const theme = useTheme();
  
  // Form state
  const [providerName, setProviderName] = useState('John Doe');
  const [timeZone, setTimeZone] = useState('UTC+05:30 - India Standard Time');
  
  // Day-wise availability state
  const [dayAvailability, setDayAvailability] = useState([
    { id: 1, day: 'Monday', fromTime: '09:00', toTime: '18:00' },
    { id: 2, day: 'Tuesday', fromTime: '09:00', toTime: '18:00' },
    { id: 3, day: 'Wednesday', fromTime: '09:00', toTime: '18:00' },
    { id: 4, day: 'Thursday', fromTime: '09:00', toTime: '18:00' },
    { id: 5, day: 'Friday', fromTime: '09:00', toTime: '18:00' },
    { id: 6, day: 'Saturday', fromTime: '09:00', toTime: '18:00' }
  ]);
  
  // Block days state
  const [blockDays, setBlockDays] = useState([
    { id: 1, date: '2024-01-15', fromTime: '12:00', toTime: '13:00', reason: 'Lunch Break' },
    { id: 2, date: '2024-01-20', fromTime: '10:00', toTime: '12:00', reason: 'Conference' }
  ]);
  
  // Saved availability state
  const [savedAvailabilities, setSavedAvailabilities] = useState([
    {
      id: 1,
      provider: 'Dr. John Smith',
      createdDate: '2024-01-10',
      totalDays: 6,
      totalHours: 54,
      status: 'Active',
      blockDays: 2
    },
    {
      id: 2,
      provider: 'Dr. Sarah Johnson',
      createdDate: '2024-01-08',
      totalDays: 5,
      totalHours: 40,
      status: 'Active',
      blockDays: 1
    }
  ]);
  
  // UI state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // Generate time options (15-minute intervals)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Validation functions
  const validateTimeRange = (fromTime, toTime) => {
    if (!fromTime || !toTime) return false;
    return fromTime < toTime;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate provider name
    if (!providerName.trim()) {
      newErrors.providerName = 'Provider name is required';
    }

    // Validate timezone
    if (!timeZone) {
      newErrors.timeZone = 'Time zone selection is required';
    }

    // Validate day availability
    dayAvailability.forEach((day, index) => {
      if (!validateTimeRange(day.fromTime, day.toTime)) {
        newErrors[`dayAvailability${index}`] = 'Invalid time range for ' + day.day;
      }
    });

    // Validate block days
    blockDays.forEach((block, index) => {
      if (!block.date) {
        newErrors[`blockDate${index}`] = 'Date is required';
      }
      if (!validateTimeRange(block.fromTime, block.toTime)) {
        newErrors[`blockTime${index}`] = 'Invalid time range';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Day availability handlers
  const addDayAvailability = () => {
    const availableDays = DAYS_OF_WEEK.filter(
      day => !dayAvailability.some(avail => avail.day === day)
    );
    
    if (availableDays.length > 0) {
      const newDay = {
        id: Date.now(),
        day: availableDays[0],
        fromTime: '09:00',
        toTime: '18:00'
      };
      setDayAvailability([...dayAvailability, newDay]);
    }
  };

  const updateDayAvailability = (id, field, value) => {
    setDayAvailability(prev =>
      prev.map(day =>
        day.id === id ? { ...day, [field]: value } : day
      )
    );
    
    // Clear related errors
    const errorKey = `dayAvailability${dayAvailability.findIndex(d => d.id === id)}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const removeDayAvailability = (id) => {
    setDayAvailability(prev => prev.filter(day => day.id !== id));
  };

  // Block days handlers
  const addBlockDay = () => {
    const newBlock = {
      id: Date.now(),
      date: '',
      fromTime: '09:00',
      toTime: '10:00',
      reason: ''
    };
    setBlockDays([...blockDays, newBlock]);
  };

  const updateBlockDay = (id, field, value) => {
    setBlockDays(prev =>
      prev.map(block =>
        block.id === id ? { ...block, [field]: value } : block
      )
    );
    
    // Clear related errors
    const index = blockDays.findIndex(b => b.id === id);
    const errorKeys = [`blockDate${index}`, `blockTime${index}`];
    errorKeys.forEach(key => {
      if (errors[key]) {
        setErrors(prev => ({ ...prev, [key]: '' }));
      }
    });
  };

  const removeBlockDay = (id) => {
    setBlockDays(prev => prev.filter(block => block.id !== id));
  };

  // Form submission
  const handleSave = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fix the validation errors before saving',
        severity: 'error'
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new availability record
      const newAvailability = {
        id: Date.now(),
        provider: providerName,
        createdDate: new Date().toISOString().split('T')[0],
        totalDays: dayAvailability.length,
        totalHours: dayAvailability.reduce((total, day) => {
          const from = new Date(`2000-01-01T${day.fromTime}`);
          const to = new Date(`2000-01-01T${day.toTime}`);
          return total + (to - from) / (1000 * 60 * 60);
        }, 0),
        status: 'Active',
        blockDays: blockDays.length
      };
      
      setSavedAvailabilities(prev => [newAvailability, ...prev]);
      
      setSnackbar({
        open: true,
        message: 'Provider availability saved successfully!',
        severity: 'success'
      });

      // TODO: Integrate with API
      // Example API integration:
      // import { providerAvailabilityAPI } from '../services/api';
      // import { ProviderAvailability } from '../models/providerAvailability';
      // 
      // const availabilityData = new ProviderAvailability({
      //   providerId: currentProviderId,
      //   providerName,
      //   timeZone,
      //   dayAvailability,
      //   blockDays
      // });
      // 
      // const response = await providerAvailabilityAPI.create(availabilityData.toApiFormat());
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save availability. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleClose = () => {
    // Reset form or navigate back
    setSnackbar({
      open: true,
      message: 'Changes discarded',
      severity: 'info'
    });
  };

  const getAvailableDays = (currentDay = '') => {
    return DAYS_OF_WEEK.filter(
      day => day === currentDay || !dayAvailability.some(avail => avail.day === day)
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#233853', fontWeight: 600 }}>
          Provider Availability
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Set your working hours and manage time blocking for optimal scheduling.
        </Typography>
      </Box>

      {/* Main Form Card */}
      <Card sx={{ mb: 3, boxShadow: '1px 1px 8px 0px rgba(0, 0, 0, 0.25)' }}>
        <CardContent sx={{ p: 3 }}>
          {/* Provider Information */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Provider"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                error={!!errors.providerName}
                helperText={errors.providerName}
                InputProps={{
                  startAdornment: <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.timeZone}>
                <InputLabel>Time Zone</InputLabel>
                <Select
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  label="Time Zone"
                >
                  {TIME_ZONES.map((tz) => (
                    <MenuItem key={tz} value={tz}>
                      {tz}
                    </MenuItem>
                  ))}
                </Select>
                {errors.timeZone && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.timeZone}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Day Wise Availability */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#21262B', fontWeight: 500 }}>
              Day Wise Availability
            </Typography>
            
            <Grid container spacing={2}>
              {dayAvailability.map((day, index) => (
                <Grid item xs={12} key={day.id}>
                  <Paper sx={{ p: 2, bgcolor: '#fafafa' }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Day</InputLabel>
                          <Select
                            value={day.day}
                            onChange={(e) => updateDayAvailability(day.id, 'day', e.target.value)}
                            label="Day"
                          >
                            {getAvailableDays(day.day).map((dayOption) => (
                              <MenuItem key={dayOption} value={dayOption}>
                                {dayOption}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>From</InputLabel>
                          <Select
                            value={day.fromTime}
                            onChange={(e) => updateDayAvailability(day.id, 'fromTime', e.target.value)}
                            label="From"
                          >
                            {timeOptions.map((time) => (
                              <MenuItem key={time} value={time}>
                                {time}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Till</InputLabel>
                          <Select
                            value={day.toTime}
                            onChange={(e) => updateDayAvailability(day.id, 'toTime', e.target.value)}
                            label="Till"
                          >
                            {timeOptions.map((time) => (
                              <MenuItem key={time} value={time}>
                                {time}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={3}>
                        <IconButton
                          onClick={() => removeDayAvailability(day.id)}
                          sx={{ 
                            bgcolor: '#fff',
                            border: '1px solid #e0e0e0',
                            '&:hover': { bgcolor: '#f5f5f5' }
                          }}
                        >
                          <Delete sx={{ color: '#373e41' }} />
                        </IconButton>
                      </Grid>
                    </Grid>
                    
                    {errors[`dayAvailability${index}`] && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        {errors[`dayAvailability${index}`]}
                      </Alert>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
            
            {dayAvailability.length < DAYS_OF_WEEK.length && (
              <Button
                startIcon={<Add />}
                onClick={addDayAvailability}
                sx={{ mt: 2 }}
                variant="outlined"
              >
                Add Day
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Block Days */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#373D41', fontWeight: 500 }}>
              Block Days
            </Typography>
            
            <Grid container spacing={2}>
              {blockDays.map((block, index) => (
                <Grid item xs={12} key={block.id}>
                  <Paper sx={{ p: 2, bgcolor: '#fafafa' }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Date"
                          type="date"
                          size="small"
                          value={block.date}
                          onChange={(e) => updateBlockDay(block.id, 'date', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>From</InputLabel>
                          <Select
                            value={block.fromTime}
                            onChange={(e) => updateBlockDay(block.id, 'fromTime', e.target.value)}
                            label="From"
                          >
                            {timeOptions.map((time) => (
                              <MenuItem key={time} value={time}>
                                {time}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Till</InputLabel>
                          <Select
                            value={block.toTime}
                            onChange={(e) => updateBlockDay(block.id, 'toTime', e.target.value)}
                            label="Till"
                          >
                            {timeOptions.map((time) => (
                              <MenuItem key={time} value={time}>
                                {time}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={3}>
                        <IconButton
                          onClick={() => removeBlockDay(block.id)}
                          sx={{ 
                            bgcolor: '#fff',
                            border: '1px solid #e0e0e0',
                            '&:hover': { bgcolor: '#f5f5f5' }
                          }}
                        >
                          <Delete sx={{ color: '#373e41' }} />
                        </IconButton>
                      </Grid>
                    </Grid>
                    
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Reason (Optional)"
                          size="small"
                          value={block.reason}
                          onChange={(e) => updateBlockDay(block.id, 'reason', e.target.value)}
                          placeholder="Meeting, Conference, Personal Time, etc."
                        />
                      </Grid>
                    </Grid>
                    
                    {(errors[`blockDate${index}`] || errors[`blockTime${index}`]) && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        {errors[`blockDate${index}`] || errors[`blockTime${index}`]}
                      </Alert>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
            
            <Button
              startIcon={<Add />}
              onClick={addBlockDay}
              sx={{ 
                mt: 2,
                bgcolor: '#E5F0FF',
                color: '#233853',
                border: '1px solid #233853',
                '&:hover': {
                  bgcolor: '#D0E7FF'
                }
              }}
              variant="outlined"
            >
              Add Block Days
            </Button>
          </Box>
        </CardContent>

        {/* Action Buttons */}
        <Box sx={{ 
          borderTop: '1px solid #E7E7E7',
          p: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2
        }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ color: '#233853' }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ 
              bgcolor: '#233853',
              '&:hover': { bgcolor: '#1a2940' }
            }}
          >
            Save
          </Button>
        </Box>
      </Card>

      {/* Saved Availabilities List */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#233853', fontWeight: 500 }}>
              Saved Provider Availabilities
            </Typography>
            <Button
              startIcon={<Visibility />}
              onClick={() => setListDialogOpen(true)}
              variant="outlined"
            >
              View All
            </Button>
          </Box>
          
          <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Provider</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total Days</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total Hours</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Block Days</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savedAvailabilities.slice(0, 5).map((availability) => (
                  <TableRow key={availability.id} hover>
                    <TableCell>{availability.provider}</TableCell>
                    <TableCell>{availability.createdDate}</TableCell>
                    <TableCell>{availability.totalDays}</TableCell>
                    <TableCell>{availability.totalHours}h</TableCell>
                    <TableCell>{availability.blockDays}</TableCell>
                    <TableCell>
                      <Chip 
                        label={availability.status} 
                        color={availability.status === 'Active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ color: '#233853' }}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#d32f2f' }}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Detailed List Dialog */}
      <Dialog open={listDialogOpen} onClose={() => setListDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          All Provider Availabilities
          <IconButton
            onClick={() => setListDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Provider</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Total Days</TableCell>
                  <TableCell>Total Hours</TableCell>
                  <TableCell>Block Days</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Time Zone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savedAvailabilities.map((availability) => (
                  <TableRow key={availability.id}>
                    <TableCell>{availability.provider}</TableCell>
                    <TableCell>{availability.createdDate}</TableCell>
                    <TableCell>{availability.totalDays}</TableCell>
                    <TableCell>{availability.totalHours}h</TableCell>
                    <TableCell>{availability.blockDays}</TableCell>
                    <TableCell>
                      <Chip 
                        label={availability.status} 
                        color={availability.status === 'Active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>UTC+05:30</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                      <IconButton size="small">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setListDialogOpen(false)}>Close</Button>
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
    </Box>
  );
};

export default ProviderAvailability;
