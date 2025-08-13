// Provider Availability Data Models

/**
 * Provider Availability Model
 * Represents a provider's weekly availability schedule
 */
export class ProviderAvailability {
  constructor({
    id = null,
    providerId,
    providerName,
    timeZone,
    dayAvailability = [],
    blockDays = [],
    createdDate = new Date().toISOString(),
    updatedDate = new Date().toISOString(),
    status = 'active',
    isDefault = false
  }) {
    this.id = id;
    this.providerId = providerId;
    this.providerName = providerName;
    this.timeZone = timeZone;
    this.dayAvailability = dayAvailability.map(day => new DayAvailability(day));
    this.blockDays = blockDays.map(block => new BlockDay(block));
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
    this.status = status; // 'active', 'inactive', 'draft'
    this.isDefault = isDefault;
  }

  // Calculate total working hours per week
  getTotalWeeklyHours() {
    return this.dayAvailability.reduce((total, day) => {
      return total + day.getDurationInHours();
    }, 0);
  }

  // Get total number of working days
  getTotalWorkingDays() {
    return this.dayAvailability.length;
  }

  // Get total number of block days
  getTotalBlockDays() {
    return this.blockDays.length;
  }

  // Check if provider is available on a specific day
  isAvailableOnDay(dayOfWeek) {
    return this.dayAvailability.some(day => day.dayOfWeek === dayOfWeek);
  }

  // Get availability for a specific day
  getDayAvailability(dayOfWeek) {
    return this.dayAvailability.find(day => day.dayOfWeek === dayOfWeek);
  }

  // Check if a specific date/time is blocked
  isTimeBlocked(date, time) {
    return this.blockDays.some(block => 
      block.date === date && 
      time >= block.fromTime && 
      time <= block.toTime
    );
  }

  // Validate the availability data
  validate() {
    const errors = [];

    if (!this.providerName || this.providerName.trim() === '') {
      errors.push('Provider name is required');
    }

    if (!this.timeZone) {
      errors.push('Time zone is required');
    }

    if (this.dayAvailability.length === 0) {
      errors.push('At least one day availability is required');
    }

    // Validate each day availability
    this.dayAvailability.forEach((day, index) => {
      const dayErrors = day.validate();
      if (dayErrors.length > 0) {
        errors.push(`Day ${index + 1}: ${dayErrors.join(', ')}`);
      }
    });

    // Validate each block day
    this.blockDays.forEach((block, index) => {
      const blockErrors = block.validate();
      if (blockErrors.length > 0) {
        errors.push(`Block day ${index + 1}: ${blockErrors.join(', ')}`);
      }
    });

    return errors;
  }

  // Convert to API format
  toApiFormat() {
    return {
      id: this.id,
      providerId: this.providerId,
      providerName: this.providerName,
      timeZone: this.timeZone,
      dayAvailability: this.dayAvailability.map(day => day.toApiFormat()),
      blockDays: this.blockDays.map(block => block.toApiFormat()),
      status: this.status,
      isDefault: this.isDefault
    };
  }

  // Create from API response
  static fromApiResponse(data) {
    return new ProviderAvailability(data);
  }
}

/**
 * Day Availability Model
 * Represents availability for a specific day of the week
 */
export class DayAvailability {
  constructor({
    id = null,
    dayOfWeek,
    fromTime,
    toTime,
    isActive = true,
    slotDuration = 15, // minutes
    breakTime = 0 // minutes between slots
  }) {
    this.id = id;
    this.dayOfWeek = dayOfWeek;
    this.fromTime = fromTime;
    this.toTime = toTime;
    this.isActive = isActive;
    this.slotDuration = slotDuration;
    this.breakTime = breakTime;
  }

  // Calculate duration in hours
  getDurationInHours() {
    if (!this.fromTime || !this.toTime) return 0;
    
    const from = new Date(`2000-01-01T${this.fromTime}`);
    const to = new Date(`2000-01-01T${this.toTime}`);
    
    return (to - from) / (1000 * 60 * 60);
  }

  // Calculate duration in minutes
  getDurationInMinutes() {
    return this.getDurationInHours() * 60;
  }

  // Get all available time slots for this day
  getTimeSlots() {
    const slots = [];
    if (!this.fromTime || !this.toTime) return slots;

    const from = new Date(`2000-01-01T${this.fromTime}`);
    const to = new Date(`2000-01-01T${this.toTime}`);
    
    let current = new Date(from);
    
    while (current < to) {
      const slotStart = current.toTimeString().slice(0, 5);
      current.setMinutes(current.getMinutes() + this.slotDuration + this.breakTime);
      
      if (current <= to) {
        const slotEnd = current.toTimeString().slice(0, 5);
        slots.push({
          startTime: slotStart,
          endTime: slotEnd,
          duration: this.slotDuration
        });
      }
    }

    return slots;
  }

  // Validate day availability
  validate() {
    const errors = [];

    if (!this.dayOfWeek) {
      errors.push('Day of week is required');
    }

    if (!this.fromTime) {
      errors.push('Start time is required');
    }

    if (!this.toTime) {
      errors.push('End time is required');
    }

    if (this.fromTime && this.toTime && this.fromTime >= this.toTime) {
      errors.push('Start time must be before end time');
    }

    if (this.slotDuration <= 0) {
      errors.push('Slot duration must be greater than 0');
    }

    return errors;
  }

  // Convert to API format
  toApiFormat() {
    return {
      id: this.id,
      dayOfWeek: this.dayOfWeek,
      fromTime: this.fromTime,
      toTime: this.toTime,
      isActive: this.isActive,
      slotDuration: this.slotDuration,
      breakTime: this.breakTime
    };
  }
}

/**
 * Block Day Model
 * Represents a blocked time period
 */
export class BlockDay {
  constructor({
    id = null,
    date,
    fromTime,
    toTime,
    reason = '',
    type = 'custom', // 'holiday', 'vacation', 'meeting', 'custom'
    isRecurring = false,
    recurringPattern = null
  }) {
    this.id = id;
    this.date = date;
    this.fromTime = fromTime;
    this.toTime = toTime;
    this.reason = reason;
    this.type = type;
    this.isRecurring = isRecurring;
    this.recurringPattern = recurringPattern;
  }

  // Calculate duration in hours
  getDurationInHours() {
    if (!this.fromTime || !this.toTime) return 0;
    
    const from = new Date(`2000-01-01T${this.fromTime}`);
    const to = new Date(`2000-01-01T${this.toTime}`);
    
    return (to - from) / (1000 * 60 * 60);
  }

  // Check if this block affects a specific time
  affectsTime(date, time) {
    return this.date === date && time >= this.fromTime && time <= this.toTime;
  }

  // Validate block day
  validate() {
    const errors = [];

    if (!this.date) {
      errors.push('Date is required');
    }

    if (!this.fromTime) {
      errors.push('Start time is required');
    }

    if (!this.toTime) {
      errors.push('End time is required');
    }

    if (this.fromTime && this.toTime && this.fromTime >= this.toTime) {
      errors.push('Start time must be before end time');
    }

    // Validate date is not in the past
    if (this.date && new Date(this.date) < new Date().setHours(0, 0, 0, 0)) {
      errors.push('Date cannot be in the past');
    }

    return errors;
  }

  // Convert to API format
  toApiFormat() {
    return {
      id: this.id,
      date: this.date,
      fromTime: this.fromTime,
      toTime: this.toTime,
      reason: this.reason,
      type: this.type,
      isRecurring: this.isRecurring,
      recurringPattern: this.recurringPattern
    };
  }
}

// Utility functions
export const ProviderAvailabilityUtils = {
  // Days of the week
  DAYS_OF_WEEK: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ],

  // Time zones
  TIME_ZONES: [
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
  ],

  // Generate time options with intervals
  generateTimeOptions: (intervalMinutes = 15) => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  },

  // Format time for display
  formatTimeForDisplay: (time24) => {
    if (!time24) return '';
    
    const [hours, minutes] = time24.split(':');
    const hour12 = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    
    return `${hour12}:${minutes} ${ampm}`;
  },

  // Convert 12-hour to 24-hour format
  convertTo24Hour: (time12) => {
    const [time, modifier] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  },

  // Get day name from date
  getDayName: (date) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = new Date(date).getDay();
    return dayNames[dayIndex];
  },

  // Check if two time ranges overlap
  timeRangesOverlap: (range1, range2) => {
    return range1.fromTime < range2.toTime && range2.fromTime < range1.toTime;
  }
};

export default ProviderAvailability;
