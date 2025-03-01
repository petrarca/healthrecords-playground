import { format } from 'date-fns';
import { QuantityValue } from '../../../types/medicalRecord';

// Helper functions for determining colors based on vital sign values
export const getSystolicColor = (value: number): string => {
  if (value > 180) return "#c62828"; // Hypertensive Crisis - Deeper Red
  if (value >= 140) return "#f44336"; // Hypertension Stage 2 - Red
  if (value >= 130) return "#ff9800"; // Hypertension Stage 1 - Orange
  if (value >= 120) return "#ffc107"; // Elevated - Yellow
  return "#4caf50"; // Normal - Green
};

export const getDiastolicColor = (value: number): string => {
  if (value > 120) return "#c62828"; // Hypertensive Crisis - Deeper Red
  if (value >= 90) return "#f44336"; // Hypertension Stage 2 - Red
  if (value >= 80) return "#ff9800"; // Hypertension Stage 1 - Orange
  return "#4caf50"; // Normal - Green
};

export const getHeartRateColor = (value: number): string => {
  if (value > 100) return "#f44336"; // Tachycardia - Red
  if (value < 60) return "#2196f3"; // Bradycardia - Blue
  return "#4caf50"; // Normal - Green
};

export const getRespiratoryRateColor = (value: number): string => {
  if (value < 12) return "#2196f3"; // Bradypnea (abnormally slow breathing) - light blue
  if (value >= 12 && value < 20) return "#4caf50"; // Normal - light green
  if (value >= 20 && value < 30) return "#ff9800"; // Tachypnea (abnormally rapid breathing) - light orange
  return "#f44336"; // Severe tachypnea (very rapid breathing) - light red
};

export const getTemperatureColor = (temp: number): string => {
  if (temp < 36.0) return "#2196f3"; // Hypothermia - light blue
  if (temp >= 36.0 && temp < 37.5) return "#4caf50"; // Normal - light green
  if (temp >= 37.5 && temp < 38.0) return "#ffc107"; // Low-grade fever - light yellow
  if (temp >= 38.0 && temp < 39.0) return "#ff9800"; // Moderate fever - light orange
  if (temp >= 39.0 && temp < 40.0) return "#f44336"; // High fever - light red
  return "#c62828"; // Very high fever - deeper red
};

// Helper function to check if an object is a QuantityValue
export const isQuantityValue = (obj: unknown): obj is QuantityValue => {
  return obj !== null && 
         typeof obj === 'object' && 
         'value' in obj;
};

// Helper functions for tooltip data processing
export interface TooltipData {
  displayValue: string;
  status: string;
  statusColor: string;
  unit: string;
}

export const getHeartRateTooltipData = (value: number): TooltipData => {
  let status = 'Normal';
  let statusColor = '#4caf50';
  
  if (value > 100) {
    status = 'Tachycardia';
    statusColor = '#f44336';
  } else if (value < 60) {
    status = 'Bradycardia';
    statusColor = '#2196f3';
  }
  
  return {
    displayValue: `${value}`,
    status,
    statusColor,
    unit: 'BPM'
  };
};

export const getBloodPressureTooltipData = (systolic?: number, diastolic?: number): TooltipData => {
  let status = 'Normal';
  let statusColor = '#4caf50';
  
  if (systolic !== undefined && diastolic !== undefined) {
    if (systolic > 180 || diastolic > 120) {
      status = 'Hypertensive Crisis';
      statusColor = '#c62828';
    } else if (systolic >= 140 || diastolic >= 90) {
      status = 'Hypertension Stage 2';
      statusColor = '#f44336';
    } else if (systolic >= 130 || diastolic >= 80) {
      status = 'Hypertension Stage 1';
      statusColor = '#ff9800';
    } else if (systolic >= 120 && diastolic < 80) {
      status = 'Elevated';
      statusColor = '#ffc107';
    }
  }
  
  return {
    displayValue: `${systolic}/${diastolic}`,
    status,
    statusColor,
    unit: 'mmHg'
  };
};

export const getTemperatureTooltipData = (temperature: number): TooltipData => {
  let status = 'Normal';
  let statusColor = '#4caf50';
  
  if (temperature < 36.0) {
    status = 'Hypothermia';
    statusColor = '#2196f3';
  } else if (temperature >= 37.5 && temperature < 38.0) {
    status = 'Low-grade fever';
    statusColor = '#ffc107';
  } else if (temperature >= 38.0 && temperature < 39.0) {
    status = 'Moderate fever';
    statusColor = '#ff9800';
  } else if (temperature >= 39.0 && temperature < 40.0) {
    status = 'High fever';
    statusColor = '#f44336';
  } else if (temperature >= 40.0) {
    status = 'Very high fever';
    statusColor = '#c62828';
  }
  
  return {
    displayValue: `${temperature.toFixed(1)}`,
    status,
    statusColor,
    unit: '°C'
  };
};

export const getRespiratoryRateTooltipData = (respiratoryRate?: number): TooltipData => {
  let status = 'Normal';
  let statusColor = '#4caf50';
  
  if (respiratoryRate !== undefined) {
    if (respiratoryRate < 12) {
      status = 'Bradypnea'; // Abnormally slow breathing
      statusColor = '#2196f3';
    } else if (respiratoryRate >= 20 && respiratoryRate < 30) {
      status = 'Tachypnea'; // Abnormally rapid breathing
      statusColor = '#ff9800';
    } else if (respiratoryRate >= 30) {
      status = 'Severe tachypnea'; // Very rapid breathing
      statusColor = '#f44336';
    }
  }
  
  return {
    displayValue: `${respiratoryRate}`,
    status,
    statusColor,
    unit: 'breaths/min'
  };
};

export interface PayloadData {
  originalDate?: Date;
  dateValue?: number;
}

export const getFormattedDate = (payload: PayloadData | undefined, label: string | number | undefined): string => {
  if (payload?.originalDate) {
    return format(payload.originalDate, 'MMM dd, yyyy');
  } else if (typeof label === 'number') {
    return format(new Date(label), 'MMM dd, yyyy');
  }
  return label?.toString() ?? '';
};
