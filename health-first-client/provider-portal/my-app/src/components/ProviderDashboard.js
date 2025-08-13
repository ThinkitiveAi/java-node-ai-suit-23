import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Avatar,
  Badge,
  useTheme,
} from '@mui/material';
import {
  Menu,
  Dashboard,
  CalendarToday,
  People,
  Notifications,
  Person,
  MedicalServices,
  Schedule,
  Settings,
  ExitToApp,
  LocalHospital,
  Event,
  Assignment,
  AccessTime,
  Chat,
  Business,
} from '@mui/icons-material';
import ProviderAvailability from './ProviderAvailability';
import AppointmentManagement from './AppointmentManagement';

const ProviderDashboard = ({ onLogout }) => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  const [notifications] = useState([
    { id: 1, message: 'New appointment request from John Doe', type: 'info', time: '1 hour ago' },
    { id: 2, message: 'Patient rescheduled appointment', type: 'warning', time: '3 hours ago' },
    { id: 3, message: 'Lab results ready for review', type: 'success', time: '1 day ago' },
  ]);

  const handleLogout = () => {
    onLogout();
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuClick = (view) => {
    setCurrentView(view);
    setDrawerOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 1, bgcolor: theme.palette.primary.main }}>
          <MedicalServices />
        </Avatar>
        <Typography variant="h6">Dr. John Smith</Typography>
        <Chip label="Provider" color="primary" size="small" />
      </Box>
      <Divider />
      <List>
        <ListItem button onClick={() => handleMenuClick('dashboard')}>
          <ListItemIcon><Dashboard /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => handleMenuClick('scheduling')}>
          <ListItemIcon><CalendarToday /></ListItemIcon>
          <ListItemText primary="Scheduling" />
        </ListItem>
        <ListItem button onClick={() => handleMenuClick('patients')}>
          <ListItemIcon><People /></ListItemIcon>
          <ListItemText primary="Patients" />
        </ListItem>
        <ListItem button onClick={() => handleMenuClick('appointments')}>
          <ListItemIcon><Event /></ListItemIcon>
          <ListItemText primary="Appointments" />
        </ListItem>
        <ListItem button onClick={() => handleMenuClick('communications')}>
          <ListItemIcon><Chat /></ListItemIcon>
          <ListItemText primary="Communications" />
        </ListItem>
        <ListItem button onClick={() => handleMenuClick('billing')}>
          <ListItemIcon><Business /></ListItemIcon>
          <ListItemText primary="Billing" />
        </ListItem>
        <ListItem button onClick={() => handleMenuClick('referral')}>
          <ListItemIcon><Assignment /></ListItemIcon>
          <ListItemText primary="Referral" />
        </ListItem>
        <ListItem button onClick={() => handleMenuClick('reports')}>
          <ListItemIcon><LocalHospital /></ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItem>
        <ListItem button onClick={() => handleMenuClick('settings')}>
          <ListItemIcon><Settings /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  const renderSettingsSubMenu = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Settings
      </Typography>
      <List>
        <ListItem button onClick={() => handleMenuClick('availability')}>
          <ListItemIcon><AccessTime /></ListItemIcon>
          <ListItemText primary="Provider Availability" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><Person /></ListItemIcon>
          <ListItemText primary="Profile Settings" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><Notifications /></ListItemIcon>
          <ListItemText primary="Notification Preferences" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><MedicalServices /></ListItemIcon>
          <ListItemText primary="Practice Settings" />
        </ListItem>
      </List>
    </Box>
  );

  const renderMainContent = () => {
    switch (currentView) {
      case 'availability':
        return <ProviderAvailability />;
      case 'scheduling':
        return <AppointmentManagement />;
      case 'settings':
        return renderSettingsSubMenu();
      default:
        return renderDashboardContent();
    }
  };

  const renderDashboardContent = () => (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Provider Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your practice and patient care efficiently.
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Today's Appointments</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                12
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3 more than yesterday
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Patients</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                487
              </Typography>
              <Typography variant="body2" color="text.secondary">
                15 new this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Pending Reviews</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                8
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lab results & reports
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalHospital color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Availability</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                85%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Event color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Appointment completed with Sarah Johnson"
                    secondary="2 hours ago"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Assignment color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Lab results reviewed for Michael Brown"
                    secondary="4 hours ago"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Chat color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Message sent to Emma Davis"
                    secondary="1 day ago"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="contained" startIcon={<CalendarToday />}>
                  View Schedule
                </Button>
                <Button variant="outlined" startIcon={<People />}>
                  Patient List
                </Button>
                <Button variant="outlined" startIcon={<AccessTime />}>
                  Set Availability
                </Button>
                <Button variant="outlined" startIcon={<Assignment />}>
                  Generate Report
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#233853'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sample EMR - Provider Portal
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={notifications.length} color="error">
              <Notifications />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          bgcolor: '#f3f3f3',
          minHeight: '100vh',
        }}
      >
        {renderMainContent()}
      </Box>
    </Box>
  );
};

export default ProviderDashboard;
