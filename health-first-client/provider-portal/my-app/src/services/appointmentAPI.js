// Appointment API Service
// This file contains all appointment-related API calls

import { apiRequest } from './api';

const APPOINTMENT_ENDPOINTS = {
  APPOINTMENTS: '/appointments',
  SCHEDULE: '/appointments/schedule',
  UPDATE: (id) => `/appointments/${id}`,
  DELETE: (id) => `/appointments/${id}`,
  PATIENT_APPOINTMENTS: (patientId) => `/appointments/patient/${patientId}`,
  PROVIDER_APPOINTMENTS: (providerId) => `/appointments/provider/${providerId}`,
  AVAILABILITY: '/appointments/availability',
  RESCHEDULE: (id) => `/appointments/${id}/reschedule`,
  CANCEL: (id) => `/appointments/${id}/cancel`,
  STATUS: (id) => `/appointments/${id}/status`,
};

/**
 * Appointment API Service Class
 * Handles all appointment-related API operations
 */
export class AppointmentAPI {
  
  /**
   * Get all appointments with filtering and pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Number of items per page
   * @param {string} params.status - Filter by status
   * @param {string} params.type - Filter by appointment type
   * @param {string} params.providerId - Filter by provider
   * @param {string} params.patientId - Filter by patient
   * @param {string} params.dateFrom - Filter from date
   * @param {string} params.dateTo - Filter to date
   * @param {string} params.search - Search query
   * @param {string} params.sortBy - Sort field
   * @param {string} params.sortOrder - Sort order (asc/desc)
   * @returns {Promise<Object>} Paginated appointments data
   */
  static async getAppointments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${APPOINTMENT_ENDPOINTS.APPOINTMENTS}?${queryString}`;
    
    try {
      const response = await apiRequest(endpoint);
      return {
        appointments: response.data,
        pagination: response.pagination,
        success: true
      };
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw new Error('Failed to fetch appointments');
    }
  }

  /**
   * Create a new appointment
   * @param {Object} appointmentData - Appointment details
   * @param {string} appointmentData.patientId - Patient ID
   * @param {string} appointmentData.providerId - Provider ID
   * @param {string} appointmentData.appointmentDate - Appointment date
   * @param {string} appointmentData.appointmentTime - Appointment time
   * @param {string} appointmentData.appointmentType - Type of appointment
   * @param {string} appointmentData.appointmentMode - Mode (in-person, video-call, home)
   * @param {string} appointmentData.reasonForVisit - Reason for visit
   * @param {number} appointmentData.estimatedAmount - Estimated cost
   * @returns {Promise<Object>} Created appointment data
   */
  static async scheduleAppointment(appointmentData) {
    try {
      const response = await apiRequest(APPOINTMENT_ENDPOINTS.SCHEDULE, {
        method: 'POST',
        body: JSON.stringify(appointmentData),
      });
      
      return {
        appointment: response.data,
        success: true,
        message: 'Appointment scheduled successfully'
      };
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      throw new Error('Failed to schedule appointment');
    }
  }

  /**
   * Update an existing appointment
   * @param {string} appointmentId - Appointment ID
   * @param {Object} updateData - Updated appointment data
   * @returns {Promise<Object>} Updated appointment data
   */
  static async updateAppointment(appointmentId, updateData) {
    try {
      const response = await apiRequest(APPOINTMENT_ENDPOINTS.UPDATE(appointmentId), {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      return {
        appointment: response.data,
        success: true,
        message: 'Appointment updated successfully'
      };
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw new Error('Failed to update appointment');
    }
  }

  /**
   * Delete an appointment
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise<Object>} Success response
   */
  static async deleteAppointment(appointmentId) {
    try {
      await apiRequest(APPOINTMENT_ENDPOINTS.DELETE(appointmentId), {
        method: 'DELETE',
      });
      
      return {
        success: true,
        message: 'Appointment deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw new Error('Failed to delete appointment');
    }
  }

  /**
   * Get appointments for a specific patient
   * @param {string} patientId - Patient ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Patient appointments data
   */
  static async getPatientAppointments(patientId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${APPOINTMENT_ENDPOINTS.PATIENT_APPOINTMENTS(patientId)}?${queryString}`;
    
    try {
      const response = await apiRequest(endpoint);
      return {
        appointments: response.data,
        success: true
      };
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
      throw new Error('Failed to fetch patient appointments');
    }
  }

  /**
   * Get appointments for a specific provider
   * @param {string} providerId - Provider ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Provider appointments data
   */
  static async getProviderAppointments(providerId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${APPOINTMENT_ENDPOINTS.PROVIDER_APPOINTMENTS(providerId)}?${queryString}`;
    
    try {
      const response = await apiRequest(endpoint);
      return {
        appointments: response.data,
        success: true
      };
    } catch (error) {
      console.error('Error fetching provider appointments:', error);
      throw new Error('Failed to fetch provider appointments');
    }
  }

  /**
   * Check provider availability for a specific date/time
   * @param {Object} availabilityData - Availability check data
   * @param {string} availabilityData.providerId - Provider ID
   * @param {string} availabilityData.date - Date to check
   * @param {string} availabilityData.time - Time to check
   * @param {number} availabilityData.duration - Duration in minutes
   * @returns {Promise<Object>} Availability data
   */
  static async checkAvailability(availabilityData) {
    try {
      const response = await apiRequest(APPOINTMENT_ENDPOINTS.AVAILABILITY, {
        method: 'POST',
        body: JSON.stringify(availabilityData),
      });
      
      return {
        available: response.data.available,
        suggestedTimes: response.data.suggestedTimes,
        success: true
      };
    } catch (error) {
      console.error('Error checking availability:', error);
      throw new Error('Failed to check availability');
    }
  }

  /**
   * Reschedule an appointment
   * @param {string} appointmentId - Appointment ID
   * @param {Object} rescheduleData - New schedule data
   * @param {string} rescheduleData.newDate - New appointment date
   * @param {string} rescheduleData.newTime - New appointment time
   * @param {string} rescheduleData.reason - Reason for rescheduling
   * @returns {Promise<Object>} Rescheduled appointment data
   */
  static async rescheduleAppointment(appointmentId, rescheduleData) {
    try {
      const response = await apiRequest(APPOINTMENT_ENDPOINTS.RESCHEDULE(appointmentId), {
        method: 'PUT',
        body: JSON.stringify(rescheduleData),
      });
      
      return {
        appointment: response.data,
        success: true,
        message: 'Appointment rescheduled successfully'
      };
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw new Error('Failed to reschedule appointment');
    }
  }

  /**
   * Cancel an appointment
   * @param {string} appointmentId - Appointment ID
   * @param {Object} cancelData - Cancellation data
   * @param {string} cancelData.reason - Reason for cancellation
   * @param {boolean} cancelData.notifyPatient - Whether to notify patient
   * @returns {Promise<Object>} Success response
   */
  static async cancelAppointment(appointmentId, cancelData) {
    try {
      const response = await apiRequest(APPOINTMENT_ENDPOINTS.CANCEL(appointmentId), {
        method: 'PUT',
        body: JSON.stringify(cancelData),
      });
      
      return {
        success: true,
        message: 'Appointment cancelled successfully'
      };
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw new Error('Failed to cancel appointment');
    }
  }

  /**
   * Update appointment status
   * @param {string} appointmentId - Appointment ID
   * @param {string} status - New status (Scheduled, Checked In, In Exam, Completed, Cancelled)
   * @param {Object} additionalData - Additional status data
   * @returns {Promise<Object>} Updated appointment data
   */
  static async updateAppointmentStatus(appointmentId, status, additionalData = {}) {
    try {
      const response = await apiRequest(APPOINTMENT_ENDPOINTS.STATUS(appointmentId), {
        method: 'PATCH',
        body: JSON.stringify({ status, ...additionalData }),
      });
      
      return {
        appointment: response.data,
        success: true,
        message: `Appointment status updated to ${status}`
      };
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw new Error('Failed to update appointment status');
    }
  }

  /**
   * Get appointment statistics for dashboard
   * @param {Object} params - Query parameters
   * @param {string} params.providerId - Provider ID (optional)
   * @param {string} params.dateFrom - Start date
   * @param {string} params.dateTo - End date
   * @returns {Promise<Object>} Statistics data
   */
  static async getAppointmentStats(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${APPOINTMENT_ENDPOINTS.APPOINTMENTS}/stats?${queryString}`;
    
    try {
      const response = await apiRequest(endpoint);
      return {
        stats: response.data,
        success: true
      };
    } catch (error) {
      console.error('Error fetching appointment statistics:', error);
      throw new Error('Failed to fetch appointment statistics');
    }
  }
}

// Export default for convenience
export default AppointmentAPI;

// Export individual functions for direct import
export const {
  getAppointments,
  scheduleAppointment,
  updateAppointment,
  deleteAppointment,
  getPatientAppointments,
  getProviderAppointments,
  checkAvailability,
  rescheduleAppointment,
  cancelAppointment,
  updateAppointmentStatus,
  getAppointmentStats,
} = AppointmentAPI;
