import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  useTheme,
  Tabs,
  Tab,
  TableSortLabel,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  MoreVert,
  Person,
  CalendarToday,
  Phone,
  VideoCall,
  Home,
  Schedule,
  FilterList,
  Close,
  MedicalServices,
} from '@mui/icons-material';

// Mock appointment data based on Figma design
const MOCK_APPOINTMENTS = [
{
  id: 1,
  dateTime: '02/24/21, 11:17am',
  appointmentType: 'New',
  patientName: 'Heena West (F)',
  patientId: 1,
  dateOfBirth: '10-21-1959 (65)',
  contactDetails: '202-555-0188',
  providerName: 'Jacob Jones',
  reasonForVisit: 'Infection Disease',
  status: 'Scheduled',
  appointmentMode: 'in-person',
  estimatedAmount: 150,
},
{
  id: 2,
  dateTime: '02/26/21, 9:40pm',
  appointmentType: 'Follow Up',
  patientName: 'Arlene McCoy (M)',
  patientId: 2,
  dateOfBirth: '10-21-1959 (42)',
  contactDetails: '202-555-0186',
  providerName: 'Bessie Cooper',
  reasonForVisit: 'Itching',
  status: 'Checked In',
  appointmentMode: 'video-call',
  estimatedAmount: 100,
},
{
  id: 3,
  dateTime: '03/07/21, 5:23am',
  appointmentType: 'New',
  patientName: 'Esther Howard (M)',
  patientId: 3,
  dateOfBirth: '10-21-1959 (32)',
  contactDetails: '202-555-0172',
  providerName: 'Wade Warren',
  reasonForVisit: 'Insomnia',
  status: 'Scheduled',
  appointmentMode: 'in-person',
  estimatedAmount: 200,
},
{
  id: 4,
  dateTime: '03/01/21, 6:05am',
  appointmentType: 'Follow Up',
  patientName: 'Jane Cooper (F)',
  patientId: 4,
  dateOfBirth: '10-21-1959 (24)',
  contactDetails: '202-555-0124',
  providerName: 'Darrell Steward',
  reasonForVisit: 'Blurred Vision',
  status: 'Cancelled',
  appointmentMode: 'home',
  estimatedAmount: 120,
},
{
  id: 5,
  dateTime: '03/10/21, 8:01pm',
  appointmentType: 'Follow Up',
  patientName: 'Darrell Steward (M)',
  patientId: 5,
  dateOfBirth: '10-21-1959 (66)',
  contactDetails: '202-555-0198',
  providerName: 'Savannah Nguyen',
  reasonForVisit: 'Hearing Loss',
  status: 'Scheduled',
  appointmentMode: 'video-call',
  estimatedAmount: 175,
},
{
  id: 6,
  dateTime: '03/03/21, 10:48am',
  appointmentType: 'New',
  patientName: 'Esther Howard (F)',
  patientId: 6,
  dateOfBirth: '10-21-1959 (12)',
  contactDetails: '202-555-0164',
  providerName: 'Arlene McCoy',
  reasonForVisit: 'Headache',
  status: 'Checked In',
  appointmentMode: 'in-person',
  estimatedAmount: 90,
},
{
  id: 7,
  dateTime: '02/26/21, 9:40pm',
  appointmentType: 'Follow Up',
  patientName: 'Bessie Cooper (M)',
  patientId: 7,
  dateOfBirth: '10-21-1959 (32)',
  contactDetails: '202-555-0175',
  providerName: 'Darlene Robertson',
  reasonForVisit: 'Stomach Pain',
  status: 'In Exam',
  appointmentMode: 'in-person',
  estimatedAmount: 130,
},
{
  id: 8,
  dateTime: '03/08/21, 8:01pm',
  appointmentType: 'New',
  patientName: 'Bessie Cooper (M)',
  patientId: 8,
  dateOfBirth: '10-21-1959 (42)',
  contactDetails: '202-555-0186',
  providerName: 'Bessie Cooper',
  reasonForVisit: 'Itching',
  status: 'Checked In',
  appointmentMode: 'video-call',
  estimatedAmount: 110,
},
{
  id: 9,
  dateTime: '03/10/21, 11:43am',
  appointmentType: 'Follow Up',
  patientName: 'Arlene McCoy (M)',
  patientId: 9,
  dateOfBirth: '10-21-1959 (32)',
  contactDetails: '202-555-0172',
  providerName: 'Wade Warren',
  reasonForVisit: 'Insomnia',
  status: 'In Exam',
  appointmentMode: 'home',
  estimatedAmount: 160,
},
{
  id: 10,
  dateTime: '03/07/21, 12:27pm',
  appointmentType: 'New',
  patientName: 'Jane Cooper (F)',
  patientId: 10,
  dateOfBirth: '10-21-1959 (24)',
  contactDetails: '202-555-0123',
  providerName: 'Darrell Steward',
  reasonForVisit: 'Blurred Vision',
  status: 'Cancelled',
  appointmentMode: 'in-person',
  estimatedAmount: 140,
},
{
  id: 11,
  dateTime: '03/05/21, 6:16pm',
  appointmentType: 'Follow Up',
  patientName: 'Darrell Steward (M)',
  patientId: 11,
  dateOfBirth: '10-21-1959 (66)',
  contactDetails: '202-555-0198',
  providerName: 'Savannah Nguyen',
  reasonForVisit: 'Hearing Loss',
  status: 'Scheduled',
  appointmentMode: 'video-call',
  estimatedAmount: 185,
},
{
  id: 12,
  dateTime: '02/24/21, 11:17am',
  appointmentType: 'New',
  patientName: 'Esther Howard (F)',
  patientId: 12,
  dateOfBirth: '10-21-1959 (37)',
  contactDetails: '202-555-0165',
  providerName: 'Robert Fox',
  reasonForVisit: 'Eye Redness',
  status: 'Cancelled',
  appointmentMode: 'in-person',
  estimatedAmount: 95,
},
];

const AppointmentList = ({ onScheduleNew, onEditAppointment }) => {
const theme = useTheme();
const [appointments] = useState(MOCK_APPOINTMENTS);
const [searchQuery, setSearchQuery] = useState('');
const [statusFilter, setStatusFilter] = useState('all');
const [appointmentTypeFilter, setAppointmentTypeFilter] = useState('all');
const [currentPage, setCurrentPage] = useState(1);
const [rowsPerPage] = useState(10);
const [sortBy, setSortBy] = useState('dateTime');
const [sortOrder, setSortOrder] = useState('desc');
const [viewMode, setViewMode] = useState('appointments');
const [anchorEl, setAnchorEl] = useState(null);
const [selectedAppointment, setSelectedAppointment] = useState(null);

// Filter and sort appointments
const filteredAppointments = useMemo(() => {
  let filtered = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.dateOfBirth.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.contactDetails.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesType = appointmentTypeFilter === 'all' || appointment.appointmentType === appointmentTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort appointments
  filtered.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'dateTime') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  return filtered;
}, [appointments, searchQuery, statusFilter, appointmentTypeFilter, sortBy, sortOrder]);

// Paginate appointments
const paginatedAppointments = useMemo(() => {
  const startIndex = (currentPage - 1) * rowsPerPage;
  return filteredAppointments.slice(startIndex, startIndex + rowsPerPage);
}, [filteredAppointments, currentPage, rowsPerPage]);

const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);

// Handle sort
const handleSort = (column) => {
  if (sortBy === column) {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  } else {
    setSortBy(column);
    setSortOrder('asc');
  }
};

// Get status color and icon
const getStatusConfig = (status) => {
  switch (status.toLowerCase()) {
    case 'scheduled':
      return { 
        color: '#5980BF', 
        bgcolor: '#F6F8FB', 
        borderColor: '#5980BF',
        icon: <Schedule fontSize="small" />
      };
    case 'checked in':
      return { 
        color: '#E8A6FF', 
        bgcolor: '#FEFAFF', 
        borderColor: '#E8A6FF',
        icon: <Person fontSize="small" />
      };
    case 'in exam':
      return { 
        color: '#6B58FF', 
        bgcolor: '#F7F6FF', 
        borderColor: '#6B58FF',
        icon: <MedicalServices fontSize="small" />
      };
    case 'cancelled':
      return { 
        color: '#EC2020', 
        bgcolor: '#FEF2F2', 
        borderColor: '#EC2020',
        icon: <Close fontSize="small" />
      };
    default:
      return { 
        color: '#727272', 
        bgcolor: '#f5f5f5', 
        borderColor: '#727272',
        icon: <Schedule fontSize="small" />
      };
  }
};

// Get appointment mode icon
const getAppointmentModeIcon = (mode) => {
  switch (mode) {
    case 'video-call':
      return <VideoCall fontSize="small" sx={{ color: '#233853' }} />;
    case 'home':
      return <Home fontSize="small" sx={{ color: '#233853' }} />;
    case 'in-person':
    default:
      return <Person fontSize="small" sx={{ color: '#233853' }} />;
  }
};

// Handle action menu
const handleActionClick = (event, appointment) => {
  setAnchorEl(event.currentTarget);
  setSelectedAppointment(appointment);
};

const handleActionClose = () => {
  setAnchorEl(null);
  setSelectedAppointment(null);
};

// Handle edit appointment
const handleEditAppointment = () => {
  if (selectedAppointment && onEditAppointment) {
    onEditAppointment(selectedAppointment);
  }
  handleActionClose();
};

return (
  <Box>
    {/* Header */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Box>
        <Typography variant="h5" gutterBottom sx={{ color: '#233853', fontWeight: 600 }}>
          Appointment Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage patient appointments and scheduling
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={onScheduleNew}
        sx={{ 
          bgcolor: '#233853',
          '&:hover': { bgcolor: '#1a2940' },
          borderRadius: '4px',
          px: 3
        }}
      >
        Schedule Appointment
      </Button>
    </Box>

    {/* Appointment View Toggle */}
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tabs
            value={viewMode}
            onChange={(e, newValue) => setViewMode(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
              },
              '& .Mui-selected': {
                bgcolor: '#F8F8F8',
                borderRadius: '4px',
              }
            }}
          >
            <Tab label="Appointments" value="appointments" />
          </Tabs>
        </Box>
      </CardContent>
    </Card>

    {/* Search and Filters */}
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by patient name, DOB"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Checked In">Checked In</MenuItem>
                <MenuItem value="In Exam">In Exam</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={appointmentTypeFilter}
                onChange={(e) => setAppointmentTypeFilter(e.target.value)}
                label="Type"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Follow Up">Follow Up</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              fullWidth
              sx={{ 
                borderColor: '#233853',
                color: '#233853',
                '&:hover': { borderColor: '#1a2940', bgcolor: 'rgba(35, 56, 83, 0.05)' }
              }}
            >
              Filter
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>

    {/* Appointments Table */}
    <Card>
      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: '#E7E7E7' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#565656' }}>
                <TableSortLabel
                  active={sortBy === 'dateTime'}
                  direction={sortBy === 'dateTime' ? sortOrder : 'asc'}
                  onClick={() => handleSort('dateTime')}
                >
                  Date & Time
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#565656' }}>
                <TableSortLabel
                  active={sortBy === 'appointmentType'}
                  direction={sortBy === 'appointmentType' ? sortOrder : 'asc'}
                  onClick={() => handleSort('appointmentType')}
                >
                  Appointment Type
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#565656' }}>
                <TableSortLabel
                  active={sortBy === 'patientName'}
                  direction={sortBy === 'patientName' ? sortOrder : 'asc'}
                  onClick={() => handleSort('patientName')}
                >
                  Patient Name
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#565656' }}>Date of Birth</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#565656' }}>Contact Details</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#565656' }}>Provider Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#565656' }}>Reason for Visit</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#565656' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#565656' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAppointments.map((appointment) => {
              const statusConfig = getStatusConfig(appointment.status);
              return (
                <TableRow 
                  key={appointment.id} 
                  hover
                  sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}
                >
                  <TableCell sx={{ color: '#727272', fontSize: '14px' }}>
                    {appointment.dateTime}
                  </TableCell>
                  <TableCell sx={{ color: '#727272', fontSize: '14px' }}>
                    {appointment.appointmentType}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: '#233853',
                          fontSize: '14px'
                        }}
                      >
                        {appointment.patientName.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#233853' }}>
                        {appointment.patientName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#727272', fontSize: '14px' }}>
                    {appointment.dateOfBirth}
                  </TableCell>
                  <TableCell sx={{ color: '#727272', fontSize: '14px' }}>
                    {appointment.contactDetails}
                  </TableCell>
                  <TableCell sx={{ color: '#727272', fontSize: '14px' }}>
                    {appointment.providerName}
                  </TableCell>
                  <TableCell sx={{ color: '#8C8C8C', fontSize: '14px' }}>
                    {appointment.reasonForVisit}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status}
                      size="small"
                      sx={{
                        color: statusConfig.color,
                        bgcolor: statusConfig.bgcolor,
                        border: `1px solid ${statusConfig.borderColor}`,
                        fontWeight: 500,
                        fontSize: '12px',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={getAppointmentModeIcon(appointment.appointmentMode)}
                        sx={{
                          color: '#233853',
                          bgcolor: '#E5F0FF',
                          border: '1px solid #233853',
                          fontSize: '13px',
                          fontWeight: 500,
                          textTransform: 'none',
                          minWidth: 'auto',
                          px: 1,
                          '&:hover': {
                            bgcolor: '#D0E7FF'
                          }
                        }}
                      >
                        Start
                      </Button>
                      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                      <Button
                        size="small"
                        startIcon={<Edit fontSize="small" />}
                        onClick={(e) => handleActionClick(e, appointment)}
                        sx={{
                          color: '#233853',
                          bgcolor: '#E5F0FF',
                          border: '1px solid #233853',
                          fontSize: '13px',
                          fontWeight: 500,
                          textTransform: 'none',
                          minWidth: 'auto',
                          px: 1,
                          '&:hover': {
                            bgcolor: '#D0E7FF'
                          }
                        }}
                      >
                        Edit
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2,
        borderTop: '1px solid #e0e0e0'
      }}>
        <Typography variant="body2" color="text.secondary">
          Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredAppointments.length)} of {filteredAppointments.length} entries
        </Typography>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          color="primary"
          sx={{
            '& .MuiPaginationItem-root': {
              borderRadius: '2px',
              '&.Mui-selected': {
                bgcolor: '#233853',
                color: 'white',
              }
            }
          }}
        />
      </Box>
    </Card>

    {/* Action Menu */}
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleActionClose}
      PaperProps={{
        sx: { minWidth: 120 }
      }}
    >
      <MenuItem onClick={handleEditAppointment}>
        <ListItemIcon>
          <Edit fontSize="small" />
        </ListItemIcon>
        <ListItemText>Edit</ListItemText>
      </MenuItem>
    </Menu>
  </Box>
);
};

export default AppointmentList;
