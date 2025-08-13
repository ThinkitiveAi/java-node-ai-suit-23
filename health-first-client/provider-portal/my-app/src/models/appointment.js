// Appointment Data Models
// This file contains data model definitions for appointment management

/**
 * Appointment Model
 * Represents a patient appointment in the system
 */
export class Appointment {
  constructor({
    id = null,
    patientId,
    patientName,
    providerId,
    providerName,
    appointmentDate,
    appointmentTime,
    appointmentType,
    appointmentMode = 'in-person',
    reasonForVisit,
    estimatedAmount,
    actualAmount = null,
    status = 'Scheduled',
    notes = '',
    createdDate = new Date().toISOString(),
    updatedDate = new Date().toISOString(),
    createdBy = null,
    updatedBy = null,
    patientDetails = null,
    providerDetails = null,
    roomNumber = null,
    duration = 30,
    isRecurring = false,
    recurringPattern = null,
    remindersSent = [],
    checkInTime = null,
    checkOutTime = null,
    cancellationReason = null,
    rescheduleHistory = [],
  }) {
    this.id = id;
    this.patientId = patientId;
    this.patientName = patientName;
    this.providerId = providerId;
    this.providerName = providerName;
    this.appointmentDate = appointmentDate;
    this.appointmentTime = appointmentTime;
    this.appointmentType = appointmentType;
    this.appointmentMode = appointmentMode;
    this.reasonForVisit = reasonForVisit;
    this.estimatedAmount = estimatedAmount;
    this.actualAmount = actualAmount;
    this.status = status;
    this.notes = notes;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.patientDetails = patientDetails ? new PatientSummary(patientDetails) : null;
    this.providerDetails = providerDetails ? new ProviderSummary(providerDetails) : null;
    this.roomNumber = roomNumber;
    this.duration = duration;
    this.isRecurring = isRecurring;
    this.recurringPattern = recurringPattern ? new RecurringPattern(recurringPattern) : null;
    this.remindersSent = remindersSent.map(reminder => new ReminderRecord(reminder));
    this.checkInTime = checkInTime;
    this.checkOutTime = checkOutTime;
    this.cancellationReason = cancellationReason;
    this.rescheduleHistory = rescheduleHistory.map(record => new RescheduleRecord(record));
  }

  /**
   * Get formatted date and time string
   * @returns {string} Formatted date and time
   */
  getFormattedDateTime() {
    const date = new Date(`${this.appointmentDate}T${this.appointmentTime}`);
    return date.toLocaleDateString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  /**
   * Get appointment duration in minutes
   * @returns {number} Duration in minutes
   */
  getDurationInMinutes() {
    return this.duration;
  }

  /**
   * Check if appointment is today
   * @returns {boolean} True if appointment is today
   */
  isToday() {
    const today = new Date().toISOString().split('T')[0];
    return this.appointmentDate === today;
  }

  /**
   * Check if appointment is in the past
   * @returns {boolean} True if appointment is in the past
   */
  isPast() {
    const appointmentDateTime = new Date(`${this.appointmentDate}T${this.appointmentTime}`);
    return appointmentDateTime < new Date();
  }

  /**
   * Check if appointment can be cancelled
   * @returns {boolean} True if appointment can be cancelled
   */
  canBeCancelled() {
    const cancelableStatuses = ['Scheduled', 'Checked In'];
    return cancelableStatuses.includes(this.status) && !this.isPast();
  }

  /**
   * Check if appointment can be rescheduled
   * @returns {boolean} True if appointment can be rescheduled
   */
  canBeRescheduled() {
    const reschedulableStatuses = ['Scheduled'];
    return reschedulableStatuses.includes(this.status) && !this.isPast();
  }

  /**
   * Get status color configuration
   * @returns {Object} Status color configuration
   */
  getStatusConfig() {
    const statusConfigs = {
      'Scheduled': { color: '#5980BF', bgcolor: '#F6F8FB', borderColor: '#5980BF' },
      'Checked In': { color: '#E8A6FF', bgcolor: '#FEFAFF', borderColor: '#E8A6FF' },
      'In Exam': { color: '#6B58FF', bgcolor: '#F7F6FF', borderColor: '#6B58FF' },
      'Completed': { color: '#28A745', bgcolor: '#F8FFF8', borderColor: '#28A745' },
      'Cancelled': { color: '#EC2020', bgcolor: '#FEF2F2', borderColor: '#EC2020' },
      'No Show': { color: '#FFA500', bgcolor: '#FFF8F0', borderColor: '#FFA500' },
    };
    return statusConfigs[this.status] || statusConfigs['Scheduled'];
  }

  /**
   * Convert to API format
   * @returns {Object} API-ready appointment data
   */
  toApiFormat() {
    return {
      patientId: this.patientId,
      providerId: this.providerId,
      appointmentDate: this.appointmentDate,
      appointmentTime: this.appointmentTime,
      appointmentType: this.appointmentType,
      appointmentMode: this.appointmentMode,
      reasonForVisit: this.reasonForVisit,
      estimatedAmount: this.estimatedAmount,
      actualAmount: this.actualAmount,
      status: this.status,
      notes: this.notes,
      roomNumber: this.roomNumber,
      duration: this.duration,
      isRecurring: this.isRecurring,
      recurringPattern: this.recurringPattern?.toApiFormat(),
    };
  }
}

/**
 * Patient Summary Model
 * Contains essential patient information for appointment display
 */
export class PatientSummary {
  constructor({
    id,
    name,
    dateOfBirth,
    age,
    gender,
    contactNumber,
    email,
    address,
    emergencyContact,
    insurance,
    allergies = [],
    medicalConditions = [],
  }) {
    this.id = id;
    this.name = name;
    this.dateOfBirth = dateOfBirth;
    this.age = age;
    this.gender = gender;
    this.contactNumber = contactNumber;
    this.email = email;
    this.address = address;
    this.emergencyContact = emergencyContact;
    this.insurance = insurance;
    this.allergies = allergies;
    this.medicalConditions = medicalConditions;
  }

  /**
   * Get formatted date of birth with age
   * @returns {string} Formatted DOB with age
   */
  getFormattedDOB() {
    return `${this.dateOfBirth} (${this.age})`;
  }

  /**
   * Get patient display name with gender
   * @returns {string} Name with gender indicator
   */
  getDisplayName() {
    const genderIndicator = this.gender ? `(${this.gender.charAt(0).toUpperCase()})` : '';
    return `${this.name} ${genderIndicator}`;
  }
}

/**
 * Provider Summary Model
 * Contains essential provider information for appointment display
 */
export class ProviderSummary {
  constructor({
    id,
    name,
    title,
    specialty,
    department,
    contactNumber,
    email,
    licenseNumber,
    isAvailable = true,
  }) {
    this.id = id;
    this.name = name;
    this.title = title;
    this.specialty = specialty;
    this.department = department;
    this.contactNumber = contactNumber;
    this.email = email;
    this.licenseNumber = licenseNumber;
    this.isAvailable = isAvailable;
  }

  /**
   * Get provider display name with title
   * @returns {string} Full provider name with title
   */
  getDisplayName() {
    return this.title ? `${this.title} ${this.name}` : this.name;
  }
}

/**
 * Recurring Pattern Model
 * Defines recurring appointment patterns
 */
export class RecurringPattern {
  constructor({
    frequency, // 'weekly', 'monthly', 'yearly'
    interval = 1, // Every X weeks/months/years
    daysOfWeek = [], // For weekly: [1,3,5] for Mon,Wed,Fri
    dayOfMonth = null, // For monthly: specific day
    endDate = null,
    occurrences = null,
  }) {
    this.frequency = frequency;
    this.interval = interval;
    this.daysOfWeek = daysOfWeek;
    this.dayOfMonth = dayOfMonth;
    this.endDate = endDate;
    this.occurrences = occurrences;
  }

  /**
   * Convert to API format
   * @returns {Object} API-ready recurring pattern data
   */
  toApiFormat() {
    return {
      frequency: this.frequency,
      interval: this.interval,
      daysOfWeek: this.daysOfWeek,
      dayOfMonth: this.dayOfMonth,
      endDate: this.endDate,
      occurrences: this.occurrences,
    };
  }
}

/**
 * Reminder Record Model
 * Tracks reminder notifications sent for appointments
 */
export class ReminderRecord {
  constructor({
    type, // 'email', 'sms', 'push'
    sentDate,
    status, // 'sent', 'delivered', 'failed'
    recipient,
  }) {
    this.type = type;
    this.sentDate = sentDate;
    this.status = status;
    this.recipient = recipient;
  }
}

/**
 * Reschedule Record Model
 * Tracks appointment reschedule history
 */
export class RescheduleRecord {
  constructor({
    originalDate,
    originalTime,
    newDate,
    newTime,
    reason,
    rescheduledBy,
    rescheduledDate,
  }) {
    this.originalDate = originalDate;
    this.originalTime = originalTime;
    this.newDate = newDate;
    this.newTime = newTime;
    this.reason = reason;
    this.rescheduledBy = rescheduledBy;
    this.rescheduledDate = rescheduledDate;
  }
}

/**
 * Appointment Status Enum
 */
export const AppointmentStatus = {
  SCHEDULED: 'Scheduled',
  CHECKED_IN: 'Checked In',
  IN_EXAM: 'In Exam',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show',
  RESCHEDULED: 'Rescheduled',
};

/**
 * Appointment Type Enum
 */
export const AppointmentType = {
  NEW_PATIENT: 'New Patient',
  FOLLOW_UP: 'Follow Up',
  CONSULTATION: 'Consultation',
  CHECK_UP: 'Check-up',
  EMERGENCY: 'Emergency',
  ROUTINE: 'Routine',
  SPECIALIST_REFERRAL: 'Specialist Referral',
  TELEHEALTH: 'Telehealth',
  PROCEDURE: 'Procedure',
  LAB_WORK: 'Lab Work',
};

/**
 * Appointment Mode Enum
 */
export const AppointmentMode = {
  IN_PERSON: 'in-person',
  VIDEO_CALL: 'video-call',
  PHONE_CALL: 'phone-call',
  HOME_VISIT: 'home',
};

/**
 * Appointment Filter Options
 */
export const AppointmentFilters = {
  status: Object.values(AppointmentStatus),
  type: Object.values(AppointmentType),
  mode: Object.values(AppointmentMode),
};

// Export all models and enums
export default {
  Appointment,
  PatientSummary,
  ProviderSummary,
  RecurringPattern,
  ReminderRecord,
  RescheduleRecord,
  AppointmentStatus,
  AppointmentType,
  AppointmentMode,
  AppointmentFilters,
};
