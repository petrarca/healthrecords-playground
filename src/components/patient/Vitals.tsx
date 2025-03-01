import { useState, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine, 
  ReferenceArea,
  TooltipProps
} from 'recharts';
import { Patient } from '../../types/types';
import { Card } from '../ui/Card';
import { useVitalSigns } from '../../hooks/useVitalSigns';
import { useAppContext } from '../../hooks/useAppContext';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Wind,
  Info
} from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { QuantityValue } from '../../types/medicalRecord';

interface VitalsProps {
  readonly patient: Patient;
}

// Custom shape for blood pressure visualization

// Helper functions for determining colors based on vital sign values
const getSystolicColor = (value: number): string => {
  if (value > 180) return "#c62828"; // Hypertensive Crisis - Deeper Red
  if (value >= 140) return "#f44336"; // Hypertension Stage 2 - Red
  if (value >= 130) return "#ff9800"; // Hypertension Stage 1 - Orange
  if (value >= 120) return "#ffc107"; // Elevated - Yellow
  return "#4caf50"; // Normal - Green
};

const getDiastolicColor = (value: number): string => {
  if (value > 120) return "#c62828"; // Hypertensive Crisis - Deeper Red
  if (value >= 90) return "#f44336"; // Hypertension Stage 2 - Red
  if (value >= 80) return "#ff9800"; // Hypertension Stage 1 - Orange
  return "#4caf50"; // Normal - Green
};

const getHeartRateColor = (value: number): string => {
  if (value > 100) return "#f44336"; // Tachycardia - Red
  if (value < 60) return "#2196f3"; // Bradycardia - Blue
  return "#4caf50"; // Normal - Green
};

const getRespiratoryRateColor = (value: number): string => {
  if (value < 12) return "#2196f3"; // Bradypnea - light blue
  if (value >= 12 && value < 20) return "#4caf50"; // Normal - light green
  if (value >= 20 && value < 30) return "#ff9800"; // Tachypnea - light orange
  return "#f44336"; // Severe tachypnea - light red
};

const getTemperatureColor = (temp: number): string => {
  if (temp < 36.0) return "#2196f3"; // Hypothermia - light blue
  if (temp >= 36.0 && temp < 37.5) return "#4caf50"; // Normal - light green
  if (temp >= 37.5 && temp < 38.0) return "#ffc107"; // Low-grade fever - light yellow
  if (temp >= 38.0 && temp < 39.0) return "#ff9800"; // Moderate fever - light orange
  if (temp >= 39.0 && temp < 40.0) return "#f44336"; // High fever - light red
  return "#c62828"; // Very high fever - deeper red
};

// Helper function to check if an object is a QuantityValue
const isQuantityValue = (obj: unknown): obj is QuantityValue => {
  return obj !== null && 
         typeof obj === 'object' && 
         'value' in obj;
};

// Custom dot renderers for the charts
interface DotRendererProps {
  cx?: number;
  cy?: number;
  value?: number;
  payload?: {
    recordId?: string;
    value?: number;
    temperature?: number;
    systolic?: number;
    diastolic?: number;
    respiratoryRate?: number;
    [key: string]: unknown;
  };
  onClick?: (recordId: string) => void;
  [key: string]: unknown;
}

const DotRenderer = (props: DotRendererProps) => {
  const { cx, cy, payload, onClick } = props;
  if (!cx || !cy || !payload) return null;
  
  let color = '';
  let size = 5;
  let strokeWidth = 2;
  
  if ('value' in payload && typeof payload.value === 'number') {
    color = getHeartRateColor(payload.value);
  } else if ('temperature' in payload && typeof payload.temperature === 'number') {
    color = getTemperatureColor(payload.temperature);
  } else if ('systolic' in payload && typeof payload.systolic === 'number') {
    color = getSystolicColor(payload.systolic);
    size = 4;
    strokeWidth = 1;
  } else if ('diastolic' in payload && typeof payload.diastolic === 'number') {
    color = getDiastolicColor(payload.diastolic);
    size = 4;
    strokeWidth = 1;
  } else if ('respiratoryRate' in payload && typeof payload.respiratoryRate === 'number') {
    color = getRespiratoryRateColor(payload.respiratoryRate);
    size = 4;
    strokeWidth = 1;
  }
  
  if (!color) return null;
  
  const handleClick = () => {
    if (onClick && payload.recordId) {
      onClick(payload.recordId);
    }
  };

  return (
    <circle
      cx={cx}
      cy={cy}
      r={size}
      stroke="#fff"
      strokeWidth={strokeWidth}
      fill={color}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={handleClick}
    />
  );
};

// Custom tooltip for vital signs
type ValueType = string | number | Array<string | number>;
type NameType = string | number;

// Define the shape of the payload items we expect
interface TooltipPayloadItem {
  value?: ValueType;
  name?: NameType;
  dataKey?: string | number;
  payload?: {
    recordId?: string;
    originalDate?: Date;
    dateValue?: number;
    systolic?: number;
    diastolic?: number;
    respiratoryRate?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// Define our custom tooltip props
interface VitalSignTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  onClick: (recordId: string) => void;
  type: 'heartRate' | 'bloodPressure' | 'temperature' | 'respiratoryRate';
}

// Create a wrapper component to handle the conversion between Recharts tooltip props and our custom component
const TooltipWrapper = (
  type: 'heartRate' | 'bloodPressure' | 'temperature' | 'respiratoryRate',
  onClick: (recordId: string) => void
) => {
  return (props: TooltipProps<ValueType, NameType>) => {
    // Convert the props to our expected format
    const customProps: VitalSignTooltipProps = {
      active: props.active,
      payload: props.payload as unknown as TooltipPayloadItem[],
      label: props.label,
      onClick,
      type
    };
    
    return <VitalSignTooltip {...customProps} />;
  };
};

// Helper functions for tooltip data processing
interface TooltipData {
  displayValue: string;
  status: string;
  statusColor: string;
  unit: string;
}

const getHeartRateTooltipData = (value: number): TooltipData => {
  let status = "Normal";
  let statusColor = "#4caf50"; // Green

  if (value > 100) {
    status = "Tachycardia";
    statusColor = "#f44336"; // Red
  } else if (value < 60) {
    status = "Bradycardia";
    statusColor = "#2196f3"; // Blue
  }

  return {
    displayValue: `${value}`,
    status,
    statusColor,
    unit: 'BPM'
  };
};

const getBloodPressureTooltipData = (systolic?: number, diastolic?: number): TooltipData => {
  let status = "Normal";
  let statusColor = "#4caf50"; // Green

  if (systolic && diastolic) {
    if (systolic > 180 || diastolic > 120) {
      status = "Hypertensive Crisis";
      statusColor = "#c62828"; // Deeper Red
    } else if (systolic >= 140 || diastolic >= 90) {
      status = "Hypertension Stage 2";
      statusColor = "#f44336"; // Red
    } else if (systolic >= 130 || diastolic >= 80) {
      status = "Hypertension Stage 1";
      statusColor = "#ff9800"; // Orange
    } else if (systolic >= 120 && diastolic < 80) {
      status = "Elevated";
      statusColor = "#ffc107"; // Yellow
    }
  }

  return {
    displayValue: `${systolic ?? 0}/${diastolic ?? 0}`,
    status,
    statusColor,
    unit: 'mmHg'
  };
};

const getTemperatureTooltipData = (temperature: number): TooltipData => {
  let status = "Normal";
  let statusColor = "#4caf50"; // Green

  if (temperature > 40.0) {
    status = "Very high fever";
    statusColor = "#c62828"; // Deeper Red
  } else if (temperature > 39.0) {
    status = "High fever";
    statusColor = "#f44336"; // Red
  } else if (temperature > 38.0) {
    status = "Moderate fever";
    statusColor = "#ff9800"; // Orange
  } else if (temperature > 37.5) {
    status = "Low-grade fever";
    statusColor = "#ffc107"; // Yellow
  } else if (temperature < 36.0) {
    status = "Hypothermia";
    statusColor = "#2196f3"; // Blue
  }

  return {
    displayValue: `${temperature.toFixed(1)}`,
    status,
    statusColor,
    unit: '°C'
  };
};

const getRespiratoryRateTooltipData = (respiratoryRate?: number): TooltipData => {
  let status = "Normal";
  let statusColor = "#4caf50"; // Green

  if (respiratoryRate && respiratoryRate > 20) {
    status = "Elevated";
    statusColor = "#ff9800"; // Orange
  } else if (respiratoryRate && respiratoryRate < 12) {
    status = "Low";
    statusColor = "#2196f3"; // Blue
  }

  return {
    displayValue: `${respiratoryRate ?? 0}`,
    status,
    statusColor,
    unit: 'breaths/min'
  };
};

interface PayloadData {
  originalDate?: Date;
  dateValue?: number;
  [key: string]: unknown;
}

const getFormattedDate = (payload: PayloadData | undefined, label: string | number | undefined): string => {
  if (payload?.originalDate) {
    return format(payload.originalDate, 'MMM dd, yyyy HH:mm');
  } else if (payload?.dateValue) {
    return format(new Date(payload.dateValue), 'MMM dd, yyyy HH:mm');
  } else if (typeof label === 'string' || typeof label === 'number') {
    return String(label);
  }
  return '';
};

const VitalSignTooltip = ({ active, payload, label, onClick, type }: VitalSignTooltipProps) => {
  if (!active || !payload?.length) return null;
  
  const recordId = payload[0]?.payload?.recordId;
  const date = getFormattedDate(payload[0]?.payload, label);
  
  let tooltipData: TooltipData;
  
  switch (type) {
    case 'heartRate':
      tooltipData = getHeartRateTooltipData(Number(payload[0]?.value ?? 0));
      break;
    case 'bloodPressure':
      tooltipData = getBloodPressureTooltipData(
        payload[0]?.payload?.systolic, 
        payload[0]?.payload?.diastolic
      );
      break;
    case 'temperature':
      tooltipData = getTemperatureTooltipData(Number(payload[0]?.value ?? 0));
      break;
    case 'respiratoryRate':
      tooltipData = getRespiratoryRateTooltipData(payload[0]?.payload?.respiratoryRate);
      break;
    default:
      tooltipData = { displayValue: '', status: 'Unknown', statusColor: '#000', unit: '' };
  }

  const handleClick = () => {
    if (recordId) {
      onClick(recordId);
    }
  };

  return (
    <button 
      className="bg-white p-2 border border-gray-200 shadow-sm rounded text-xs cursor-pointer w-full text-left"
      onClick={handleClick}
      type="button"
    >
      <p className="font-medium mb-0.5">{date}</p>
      <p className="text-purple-600 mb-0.5">{`${tooltipData.displayValue} ${tooltipData.unit}`}</p>
      <p style={{ color: tooltipData.statusColor }} className="font-medium mb-0">
        {`Status: ${tooltipData.status}`}
      </p>
    </button>
  );
};

// Blood pressure info tooltip component
const BPInfoTooltip = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button 
          className="ml-2 inline-flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Info size={16} className="text-gray-500 cursor-pointer" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          className="w-72 bg-white rounded-md shadow-lg z-10 p-3 text-xs"
          sideOffset={5}
          align="end"
          collisionPadding={10}
          avoidCollisions
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h4 className="font-bold mb-2">Blood Pressure Categories</h4>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-1 w-8"></th>
                <th className="py-1 text-left">Category</th>
                <th className="py-1 text-left">Systolic</th>
                <th className="py-1 text-left">Diastolic</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#4caf50" }}></div>
                </td>
                <td className="py-1 font-medium">Normal</td>
                <td className="py-1">&lt;120 mmHg</td>
                <td className="py-1">and &lt;80 mmHg</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#ffc107" }}></div>
                </td>
                <td className="py-1 font-medium">Elevated</td>
                <td className="py-1">120-129 mmHg</td>
                <td className="py-1">and &lt;80 mmHg</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#ff9800" }}></div>
                </td>
                <td className="py-1 font-medium">Hypertension Stage 1</td>
                <td className="py-1">130-139 mmHg</td>
                <td className="py-1">or 80-89 mmHg</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#f44336" }}></div>
                </td>
                <td className="py-1 font-medium">Hypertension Stage 2</td>
                <td className="py-1">≥140 mmHg</td>
                <td className="py-1">or ≥90 mmHg</td>
              </tr>
              <tr>
                <td className="py-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#c62828" }}></div>
                </td>
                <td className="py-1 font-medium">Hypertensive Crisis</td>
                <td className="py-1">&gt;180 mmHg</td>
                <td className="py-1">and/or &gt;120 mmHg</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-gray-500 text-[10px] italic">
            Source: American College of Cardiology/American Heart Association (ACC/AHA) 2017 Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults
          </p>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

// Heart rate info tooltip component
const HRInfoTooltip = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button 
          className="ml-2 inline-flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Info size={16} className="text-gray-500 cursor-pointer" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          className="w-72 bg-white rounded-md shadow-lg z-10 p-3 text-xs"
          sideOffset={5}
          align="end"
          collisionPadding={10}
          avoidCollisions
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h4 className="font-bold mb-2">Heart Rate Categories</h4>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-1 w-8"></th>
                <th className="py-1 text-left">Category</th>
                <th className="py-1 text-left">Range</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#2196f3" }}></div>
                </td>
                <td className="py-1 font-medium">Bradycardia</td>
                <td className="py-1">&lt;60 BPM</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#4caf50" }}></div>
                </td>
                <td className="py-1 font-medium">Normal</td>
                <td className="py-1">60-100 BPM</td>
              </tr>
              <tr>
                <td className="py-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#f44336" }}></div>
                </td>
                <td className="py-1 font-medium">Tachycardia</td>
                <td className="py-1">&gt;100 BPM</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-gray-500 text-[10px] italic">
            Source: American Heart Association (AHA) Guidelines for Normal Resting Heart Rate
          </p>
          <p className="mt-1 text-gray-500 text-[10px]">
            Note: Heart rate varies significantly with activity level, age, medications, and clinical condition. These reference ranges apply to resting heart rate for adults.
          </p>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

// Temperature info tooltip component
const TempInfoTooltip = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button 
          className="ml-2 inline-flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Info size={16} className="text-gray-500 cursor-pointer" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          className="w-80 bg-white rounded-md shadow-lg z-10 p-3 text-xs"
          sideOffset={5}
          align="end"
          collisionPadding={10}
          avoidCollisions
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h4 className="font-bold mb-2">Temperature Categories</h4>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-1 w-8"></th>
                <th className="py-1 text-left">Category</th>
                <th className="py-1 text-left">Range</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#2196f3" }}></div>
                </td>
                <td className="py-1 font-medium">Hypothermia</td>
                <td className="py-1">&lt;36.0°C</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#4caf50" }}></div>
                </td>
                <td className="py-1 font-medium">Normal</td>
                <td className="py-1">36.0-37.5°C</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#ffc107" }}></div>
                </td>
                <td className="py-1 font-medium">Low-grade fever</td>
                <td className="py-1">37.5-38.0°C</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#ff9800" }}></div>
                </td>
                <td className="py-1 font-medium">Moderate fever</td>
                <td className="py-1">38.0-39.0°C</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#f44336" }}></div>
                </td>
                <td className="py-1 font-medium">High fever</td>
                <td className="py-1">39.0-40.0°C</td>
              </tr>
              <tr>
                <td className="py-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#c62828" }}></div>
                </td>
                <td className="py-1 font-medium">Very high fever</td>
                <td className="py-1">&gt;40.0°C</td>
              </tr>
            </tbody>
          </table>
          
          <h4 className="font-bold mt-3 mb-1">Measurement Method Notes:</h4>
          <ul className="list-disc pl-4 space-y-1">
            <li>Oral temperature is typically 0.5°C lower than core body temperature</li>
            <li>Axillary (armpit) temperature is typically 0.5°C lower than oral temperature</li>
            <li>Rectal and tympanic (ear) temperatures are closer to core body temperature</li>
          </ul>
          
          <p className="mt-2 text-gray-500 text-[10px] italic">
            Source: World Health Organization (WHO) and National Institute for Health and Care Excellence (NICE) Guidelines for Temperature Assessment
          </p>
          <p className="mt-1 text-gray-500 text-[10px]">
            Note: Normal temperature can vary by up to 0.5°C throughout the day, with lowest temperatures typically in early morning and highest in late afternoon. Temperature ranges may vary slightly between different clinical guidelines.
          </p>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

// Respiratory rate info tooltip component
const RRInfoTooltip = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button 
          className="ml-2 inline-flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Info size={16} className="text-gray-500 cursor-pointer" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          className="w-72 bg-white rounded-md shadow-lg z-10 p-3 text-xs"
          sideOffset={5}
          align="end"
          collisionPadding={10}
          avoidCollisions
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h4 className="font-bold mb-2">Respiratory Rate Categories</h4>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-1 w-8"></th>
                <th className="py-1 text-left">Category</th>
                <th className="py-1 text-left">Range</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#2196f3" }}></div>
                </td>
                <td className="py-1 font-medium">Bradypnea</td>
                <td className="py-1">&lt;12 breaths/min</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#4caf50" }}></div>
                </td>
                <td className="py-1 font-medium">Normal range</td>
                <td className="py-1">12-20 breaths/min</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#ff9800" }}></div>
                </td>
                <td className="py-1 font-medium">Tachypnea</td>
                <td className="py-1">20-30 breaths/min</td>
              </tr>
              <tr>
                <td className="py-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#f44336" }}></div>
                </td>
                <td className="py-1 font-medium">Severe tachypnea</td>
                <td className="py-1">&gt;30 breaths/min</td>
              </tr>
            </tbody>
          </table>
          
          <p className="mt-2 text-gray-500 text-[10px] italic">
            Source: American Thoracic Society Guidelines and National Early Warning Score (NEWS) 2 – Royal College of Physicians
          </p>
          <p className="mt-1 text-gray-500 text-[10px]">
            Note: Respiratory rate should be assessed over a full minute when possible. Rate may be affected by activity, emotions, pain, medication, and underlying conditions. Increased work of breathing and abnormal breathing patterns should also be noted alongside rate.
          </p>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export function Vitals({ patient }: VitalsProps) {
  const { data: vitalRecords, isLoading, error, refetch } = useVitalSigns(patient?.id);
  const { navigateTo } = useAppContext();
  
  // States to track the latest selected data points
  const [selectedHeartRateRecord, setSelectedHeartRateRecord] = useState<string | null>(null);
  const [selectedBloodPressureRecord, setSelectedBloodPressureRecord] = useState<string | null>(null);
  const [selectedTemperatureRecord, setSelectedTemperatureRecord] = useState<string | null>(null);
  const [hoveredRespiratoryRatePoint, setHoveredRespiratoryRatePoint] = useState<{ recordId: string } | null>(null);

  // Function to navigate to a record
  const navigateToRecord = useCallback((recordId: string) => {
    if (patient?.id) {
      navigateTo('timeline', patient.id, recordId);
    }
  }, [navigateTo, patient?.id]);

  // Wrapper functions to avoid inline component definitions
  const HeartRateDotWithClickRenderer = useCallback((props: DotRendererProps) => {
    return <DotRenderer {...props} onClick={navigateToRecord} />;
  }, [navigateToRecord]);

  const BloodPressureDotRenderer = useCallback((props: DotRendererProps) => {
    return <DotRenderer {...props} />;
  }, []);

  const TemperatureDotWithClickRenderer = useCallback((props: DotRendererProps) => {
    return <DotRenderer {...props} onClick={navigateToRecord} />;
  }, [navigateToRecord]);

  const RespiratoryRateDotWithClickRenderer = useCallback((props: DotRendererProps) => {
    return <DotRenderer {...props} onClick={navigateToRecord} />;
  }, [navigateToRecord]);

  // Transform the data for heart rate chart
  const heartRateChartData = useMemo(() => {
    if (!vitalRecords) return [];
    
    return vitalRecords
      .filter(record => record?.details?.heart_rate !== undefined)
      .map(record => {
        try {
          let heartRate = 0;
          
          // Handle heart rate in quantity object format
          if (typeof record?.details?.heart_rate === 'object') {
            const hrObj = record?.details?.heart_rate;
            if (isQuantityValue(hrObj) && hrObj.value !== undefined) {
              heartRate = typeof hrObj.value === 'string' ? parseFloat(hrObj.value) : hrObj.value;
            }
          } 
          // Handle heart rate as direct value
          else if (record?.details?.heart_rate !== undefined) {
            heartRate = typeof record.details.heart_rate === 'string' 
              ? parseFloat(record.details.heart_rate) 
              : Number(record.details.heart_rate);
          }
          
          return {
            date: format(record.recordedAt, 'MMM dd'),
            dateValue: record.recordedAt.getTime(),
            originalDate: record.recordedAt,
            value: heartRate,
            recordId: record.recordId
          };
        } catch (_error) {
          return null;
        }
      })
      .filter(Boolean) // Remove any null entries
      .sort((a, b) => (a?.dateValue ?? 0) - (b?.dateValue ?? 0));
  }, [vitalRecords]);

  // Transform the data for the blood pressure chart
  const bloodPressureChartData = useMemo(() => {
    if (!vitalRecords) return [];
    
    return vitalRecords
      .filter(record => {
        return record?.details?.blood_pressure;
      })
      .map(record => {
        try {
          // First convert to unknown, then to the specific type we need
          const bp = record?.details?.blood_pressure as unknown as {
            systolic?: string | number;
            diastolic?: string | number;
            value?: string | number;
          };
          
          if (bp.systolic && bp.diastolic) {
            const systolic = typeof bp.systolic === 'string' ? parseFloat(bp.systolic) : bp.systolic;
            const diastolic = typeof bp.diastolic === 'string' ? parseFloat(bp.diastolic) : bp.diastolic;
            return {
              date: format(record.recordedAt, 'MMM dd'),
              dateValue: record.recordedAt.getTime(),
              originalDate: record.recordedAt,
              systolic,
              diastolic,
              recordId: record.recordId
            };
          } 
          // Check if blood pressure is in string format "systolic/diastolic"
          else if (typeof bp.value === 'string' && bp.value.includes('/')) {
            const bpParts = bp.value.split('/');
            const systolic = parseFloat(bpParts[0].trim());
            const diastolic = parseFloat(bpParts[1].trim());
            return {
              date: format(record.recordedAt, 'MMM dd'),
              dateValue: record.recordedAt.getTime(),
              originalDate: record.recordedAt,
              systolic,
              diastolic,
              recordId: record.recordId
            };
          }
          return null;
        } catch (_error) {
          console.error('Error processing blood pressure data:', _error);
          return null;
        }
      })
      .filter(Boolean) // Remove any null entries
      .sort((a, b) => (a?.dateValue ?? 0) - (b?.dateValue ?? 0));
  }, [vitalRecords]);

  // Transform the data for temperature chart
  const temperatureChartData = useMemo(() => {
    if (!vitalRecords) return [];
    
    return vitalRecords
      .filter(record => record?.details?.temperature !== undefined)
      .map(record => {
        try {
          let temperature = 0;
          
          // Handle temperature in quantity object format
          if (typeof record?.details?.temperature === 'object') {
            const tempObj = record?.details?.temperature;
            if (isQuantityValue(tempObj) && tempObj.value !== undefined) {
              temperature = typeof tempObj.value === 'string' ? parseFloat(tempObj.value) : tempObj.value;
            }
          } 
          // Handle temperature as direct value
          else if (record?.details?.temperature !== undefined) {
            temperature = typeof record.details.temperature === 'string' 
              ? parseFloat(record.details.temperature) 
              : Number(record.details.temperature);
          }
          
          return {
            date: format(record.recordedAt, 'MMM dd'),
            dateValue: record.recordedAt.getTime(),
            originalDate: record.recordedAt,
            temperature,
            recordId: record.recordId
          };
        } catch (_error) {
          return null;
        }
      })
      .filter(Boolean) // Remove any null entries
      .sort((a, b) => (a?.dateValue ?? 0) - (b?.dateValue ?? 0));
  }, [vitalRecords]);

  // Transform the data for respiratory rate chart
  const respiratoryRateChartData = useMemo(() => {
    if (!vitalRecords) return [];
    
    return vitalRecords
      .filter(record => record?.details?.respiratory_rate !== undefined)
      .map(record => {
        try {
          let respiratoryRate = 0;
          
          // Handle respiratory rate in quantity object format
          if (typeof record?.details?.respiratory_rate === 'object') {
            const rrObj = record?.details?.respiratory_rate;
            if (isQuantityValue(rrObj) && rrObj.value !== undefined) {
              respiratoryRate = typeof rrObj.value === 'string' ? parseFloat(rrObj.value) : rrObj.value;
            }
          } 
          // Handle respiratory rate as direct value
          else if (record?.details?.respiratory_rate !== undefined) {
            respiratoryRate = typeof record.details.respiratory_rate === 'string' 
              ? parseFloat(record.details.respiratory_rate) 
              : Number(record.details.respiratory_rate);
          }
          
          return {
            date: format(record.recordedAt, 'MMM dd'),
            dateValue: record.recordedAt.getTime(),
            originalDate: record.recordedAt,
            respiratoryRate,
            recordId: record.recordId
          };
        } catch (_error) {
          return null;
        }
      })
      .filter(Boolean) // Remove any null entries
      .sort((a, b) => (a?.dateValue ?? 0) - (b?.dateValue ?? 0));
  }, [vitalRecords]);

  if (!patient) return null;

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vital signs data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl mb-2">Error loading vital signs</p>
          <p className="text-sm">{error.message}</p>
          <button 
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            onClick={refetch}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if we have any data to display
  const hasBloodPressureData = bloodPressureChartData.length > 0;
  const hasTemperatureData = temperatureChartData.length > 0;
  const hasRespiratoryRateData = respiratoryRateChartData.length > 0;

  // Get the most recent records for each vital sign
  const mostRecentHeartRateRecord = heartRateChartData.length > 0 ? heartRateChartData[heartRateChartData.length - 1] : null;
  const mostRecentBloodPressureRecord = bloodPressureChartData.length > 0 ? bloodPressureChartData[bloodPressureChartData.length - 1] : null;
  const mostRecentTemperatureRecord = temperatureChartData.length > 0 ? temperatureChartData[temperatureChartData.length - 1] : null;
  const mostRecentRespiratoryRateRecord = respiratoryRateChartData.length > 0 ? respiratoryRateChartData[respiratoryRateChartData.length - 1] : null;

  return (
    <div className="w-full space-y-2 overflow-auto max-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Heart Rate Card */}
        <Card
          title="Heart Rate"
          icon={<Heart size={16} />}
          variant="purple"
          headerContent={<HRInfoTooltip />}
          onClick={() => mostRecentHeartRateRecord && navigateToRecord(mostRecentHeartRateRecord.recordId)}
        >
          <div className="w-full">
            <p className="text-xs text-gray-500 mb-1">Beats per minute (BPM) over time</p>
            
            <div className="h-36 w-full mt-2">
              {heartRateChartData.length > 0 ? (
                <button 
                  className="w-full h-full cursor-pointer" 
                  onClick={() => {
                    if (selectedHeartRateRecord) {
                      navigateToRecord(selectedHeartRateRecord);
                    } else if (mostRecentHeartRateRecord) {
                      navigateToRecord(mostRecentHeartRateRecord.recordId);
                    }
                  }}
                  aria-label="View heart rate record details"
                  disabled={!selectedHeartRateRecord && !mostRecentHeartRateRecord}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={heartRateChartData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      style={{ cursor: 'pointer' }}
                      onMouseMove={(data) => {
                        if (data?.activePayload?.[0]?.payload?.recordId) {
                          setSelectedHeartRateRecord(data.activePayload[0].payload.recordId);
                        }
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="dateValue" 
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(unixTime) => format(new Date(unixTime), 'MMM dd')}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[40, 120]} 
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        content={TooltipWrapper('heartRate', navigateToRecord)} 
                      />
                      
                      {/* Color-coded reference areas for heart rate categories */}
                      <ReferenceArea key="hr-area-tachy" y1={100} y2={120} fill="#f44336" fillOpacity={0.1} /> {/* Tachycardia */}
                      <ReferenceArea key="hr-area-normal" y1={60} y2={100} fill="#4caf50" fillOpacity={0.1} /> {/* Normal */}
                      <ReferenceArea key="hr-area-brady" y1={40} y2={60} fill="#2196f3" fillOpacity={0.1} /> {/* Bradycardia */}
                      
                      {/* Horizontal reference lines at key threshold values */}
                      <ReferenceLine key="hr-line-100" y={100} stroke="#f44336" strokeDasharray="3 3" />
                      <ReferenceLine key="hr-line-60" y={60} stroke="#2196f3" strokeDasharray="3 3" />
                      
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8884d8" 
                        dot={HeartRateDotWithClickRenderer}
                        activeDot={{ r: 8, style: { cursor: 'pointer' } }}
                        style={{ cursor: 'pointer' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </button>
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <p className="text-gray-400 text-sm">No heart rate data available</p>
                </div>
              )}
            </div>
            
            <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
              <button 
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                  }
                }}
                className="bg-transparent border-0 p-0 m-0 text-left"
                type="button"
                aria-label="Chart legend section"
              >
                <fieldset 
                  className="flex items-center text-xs border-0 p-0 m-0"
                  aria-label="Chart legend"
                >
                  <legend className="sr-only">Chart Legend</legend>
                  <div className="flex flex-wrap">
                    <span key="hr-legend-brady" className="mr-2 mb-1">
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#2196f3', marginRight: '4px' }}></span>
                      <span>Bradycardia: &lt;60 BPM</span>
                    </span>
                    <span key="hr-legend-normal" className="mr-2 mb-1">
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#4caf50', marginRight: '4px' }}></span>
                      <span>Normal: 60-100 BPM</span>
                    </span>
                    <span key="hr-legend-tachy" className="mr-2 mb-1">
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#f44336', marginRight: '4px' }}></span>
                      <span>Tachycardia: &gt;100 BPM</span>
                    </span>
                  </div>
                </fieldset>
              </button>
              {heartRateChartData.length > 0 && mostRecentHeartRateRecord && (
                <span className="mr-2">
                  Latest: <strong>{mostRecentHeartRateRecord.value} BPM</strong>
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Blood Pressure Card */}
        <Card
          title="Blood Pressure"
          icon={<Activity size={16} />}
          variant="purple"
          headerContent={<BPInfoTooltip />}
          onClick={() => mostRecentBloodPressureRecord && navigateToRecord(mostRecentBloodPressureRecord.recordId)}
        >
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs text-gray-500">Systolic/Diastolic pressure (mmHg) over time</p>
              <button 
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                  }
                }}
                className="bg-transparent border-0 p-0 m-0 text-left"
                type="button"
                aria-label="Blood pressure legend section"
              >
                <fieldset 
                  className="flex items-center text-xs border-0 p-0 m-0"
                  aria-label="Chart legend"
                >
                  <legend className="sr-only">Chart Legend</legend>
                  <div className="flex flex-wrap">
                    <span key="bp-legend-systolic" className="mr-2 mb-1">
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#f44336', marginRight: '4px' }}></span>
                      <span>Systolic</span>
                    </span>
                    <span key="bp-legend-diastolic" className="mr-2 mb-1">
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#2196f3', marginRight: '4px' }}></span>
                      <span>Diastolic</span>
                    </span>
                  </div>
                </fieldset>
              </button>
            </div>
            <button 
              className="h-48 w-full bg-transparent border-0 p-0 text-left" 
              onClick={() => selectedBloodPressureRecord && navigateToRecord(selectedBloodPressureRecord)}
              aria-label="View blood pressure record details"
              disabled={!selectedBloodPressureRecord}
            >
              {hasBloodPressureData ? (
                <button 
                  className="w-full h-full cursor-pointer bg-transparent border-0 p-0 text-left" 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering parent button click
                    if (selectedBloodPressureRecord) {
                      navigateToRecord(selectedBloodPressureRecord);
                    } else if (mostRecentBloodPressureRecord) {
                      navigateToRecord(mostRecentBloodPressureRecord.recordId);
                    }
                  }}
                  aria-label="View selected blood pressure record"
                  disabled={!selectedBloodPressureRecord && !mostRecentBloodPressureRecord}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={bloodPressureChartData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      style={{ userSelect: 'none', cursor: 'pointer' }}
                      onMouseMove={(data) => {
                        if (data?.activePayload?.[0]?.payload?.recordId) {
                          setSelectedBloodPressureRecord(data.activePayload[0].payload.recordId);
                        }
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="dateValue" 
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(unixTime) => format(new Date(unixTime), 'MMM dd')}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[40, 200]} 
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        content={TooltipWrapper('bloodPressure', navigateToRecord)} 
                      />
                      
                      {/* Color-coded reference areas for blood pressure categories */}
                      <ReferenceArea key="bp-area-crisis" y1={180} y2={200} fill="#c62828" fillOpacity={0.1} />
                      <ReferenceArea key="bp-area-stage2" y1={140} y2={180} fill="#f44336" fillOpacity={0.1} />
                      <ReferenceArea key="bp-area-stage1-1" y1={130} y2={140} fill="#ff9800" fillOpacity={0.1} />
                      <ReferenceArea key="bp-area-elevated" y1={120} y2={130} fill="#ffc107" fillOpacity={0.1} />
                      <ReferenceArea key="bp-area-normal-1" y1={90} y2={120} fill="#4caf50" fillOpacity={0.1} />
                      <ReferenceArea key="bp-area-stage1-2" y1={80} y2={90} fill="#ff9800" fillOpacity={0.1} />
                      <ReferenceArea key="bp-area-normal-2" y1={40} y2={80} fill="#4caf50" fillOpacity={0.1} />
                      
                      {/* Horizontal reference lines at key threshold values */}
                      <ReferenceLine key="bp-line-180" y={180} stroke="#c62828" strokeDasharray="3 3" />
                      <ReferenceLine key="bp-line-140" y={140} stroke="#f44336" strokeDasharray="3 3" />
                      <ReferenceLine key="bp-line-130" y={130} stroke="#ff9800" strokeDasharray="3 3" />
                      <ReferenceLine key="bp-line-120" y={120} stroke="#ffc107" strokeDasharray="3 3" />
                      <ReferenceLine key="bp-line-90" y={90} stroke="#f44336" strokeDasharray="3 3" />
                      <ReferenceLine key="bp-line-80" y={80} stroke="#ff9800" strokeDasharray="3 3" />
                      
                      <Line 
                        type="monotone" 
                        dataKey="systolic" 
                        stroke="#f44336" 
                        strokeWidth={2}
                        dot={BloodPressureDotRenderer}
                        activeDot={{ r: 6, fill: '#f44336' }}
                        isAnimationActive={false}
                        name="Systolic"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="diastolic" 
                        stroke="#2196f3" 
                        strokeWidth={2}
                        dot={BloodPressureDotRenderer}
                        activeDot={{ r: 6, fill: '#2196f3' }}
                        isAnimationActive={false}
                        name="Diastolic"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </button>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No blood pressure data available</p>
                </div>
              )}
            </button>
            <div className="mt-1 text-xs text-gray-500 flex justify-between">
              <button 
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                  }
                }}
                className="bg-transparent border-0 p-0 m-0 text-left"
                type="button"
                aria-label="Chart legend section"
              >
                <fieldset 
                  className="flex items-center text-xs border-0 p-0 m-0"
                  aria-label="Chart legend"
                >
                  <legend className="sr-only">Chart Legend</legend>
                  <div className="flex flex-wrap">
                    <span key="bp-legend-normal" className="mr-2">
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#4caf50', marginRight: '4px' }}></span>
                      <span>Normal: &lt;120/&lt;80</span>
                    </span>
                    <span key="bp-legend-elevated" className="mr-2">
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#ffc107', marginRight: '4px' }}></span>
                      <span>Elevated: 120-129/&lt;80</span>
                    </span>
                    <span key="bp-legend-stage1">
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#ff9800', marginRight: '4px' }}></span>
                      <span>Stage 1: 130-139/80-89</span>
                    </span>
                  </div>
                </fieldset>
              </button>
              {hasBloodPressureData && mostRecentBloodPressureRecord?.systolic !== undefined && mostRecentBloodPressureRecord?.diastolic !== undefined && (
                <span>
                  Latest: <strong>{mostRecentBloodPressureRecord.systolic}/{mostRecentBloodPressureRecord.diastolic} mmHg</strong>
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Temperature Card */}
        <Card
          title="Temperature"
          icon={<Thermometer size={16} />}
          variant="amber"
          headerContent={<TempInfoTooltip />}
          onClick={() => mostRecentTemperatureRecord && navigateToRecord(mostRecentTemperatureRecord.recordId)}
        >
          <div>
            <p className="text-xs text-gray-500 mb-1">Body temperature (°C) over time</p>
            
            <div className="h-36 w-full mt-1">
              {hasTemperatureData ? (
                <button 
                  className="w-full h-full cursor-pointer" 
                  onClick={() => {
                    if (selectedTemperatureRecord) {
                      navigateToRecord(selectedTemperatureRecord);
                    } else if (mostRecentTemperatureRecord) {
                      navigateToRecord(mostRecentTemperatureRecord.recordId);
                    }
                  }}
                  aria-label="View temperature record details"
                  disabled={!selectedTemperatureRecord && !mostRecentTemperatureRecord}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={temperatureChartData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      style={{ cursor: 'pointer' }}
                      onMouseMove={(data) => {
                        if (data?.activePayload?.[0]?.payload?.recordId) {
                          setSelectedTemperatureRecord(data.activePayload[0].payload.recordId);
                        }
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="dateValue" 
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(unixTime) => format(new Date(unixTime), 'MMM dd')}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[35, 41]} 
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        content={TooltipWrapper('temperature', navigateToRecord)} 
                      />
                      
                      {/* Color-coded reference areas for temperature categories */}
                      <ReferenceArea key="temp-area-vhigh" y1={40} y2={41} fill="#c62828" fillOpacity={0.1} /> {/* Very high fever */}
                      <ReferenceArea key="temp-area-high" y1={39} y2={40} fill="#f44336" fillOpacity={0.1} /> {/* High fever */}
                      <ReferenceArea key="temp-area-moderate" y1={38} y2={39} fill="#ff9800" fillOpacity={0.1} /> {/* Moderate fever */}
                      <ReferenceArea key="temp-area-lowgrade" y1={37.5} y2={38} fill="#ffc107" fillOpacity={0.1} /> {/* Low-grade fever */}
                      <ReferenceArea key="temp-area-normal" y1={36} y2={37.5} fill="#4caf50" fillOpacity={0.1} /> {/* Normal */}
                      <ReferenceArea key="temp-area-hypo" y1={35} y2={36} fill="#2196f3" fillOpacity={0.1} /> {/* Hypothermia */}
                      
                      {/* Horizontal reference lines at key threshold values */}
                      <ReferenceLine key="temp-line-40" y={40} stroke="#c62828" strokeDasharray="3 3" />
                      <ReferenceLine key="temp-line-39" y={39} stroke="#f44336" strokeDasharray="3 3" />
                      <ReferenceLine key="temp-line-38" y={38} stroke="#ff9800" strokeDasharray="3 3" />
                      <ReferenceLine key="temp-line-37.5" y={37.5} stroke="#ffc107" strokeDasharray="3 3" />
                      <ReferenceLine key="temp-line-36" y={36} stroke="#2196f3" strokeDasharray="3 3" />
                      
                      <Line
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#2196f3" 
                        dot={TemperatureDotWithClickRenderer}
                        activeDot={{ r: 8, style: { cursor: 'pointer' } }}
                        style={{ cursor: 'pointer' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </button>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No temperature data available</p>
                </div>
              )}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              <div className="flex justify-between items-center mb-1">
                <button 
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                    }
                  }}
                  className="bg-transparent border-0 p-0 m-0 text-left"
                  type="button"
                  aria-label="Chart legend section"
                >
                  <fieldset 
                    className="flex items-center text-xs border-0 p-0 m-0"
                    aria-label="Chart legend"
                  >
                    <legend className="sr-only">Chart Legend</legend>
                    <div className="flex flex-wrap">
                      <span key="temp-legend-hypo" className="mr-2 mb-1">
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#2196f3', marginRight: '4px' }}></span>
                        <span>Hypothermia</span>
                      </span>
                      <span key="temp-legend-normal" className="mr-2 mb-1">
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#4caf50', marginRight: '4px' }}></span>
                        <span>Normal</span>
                      </span>
                      <span key="temp-legend-lowfever" className="mr-2 mb-1">
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#ffc107', marginRight: '4px' }}></span>
                        <span>Low-grade fever</span>
                      </span>
                    </div>
                  </fieldset>
                </button>
                <div className="flex items-center">
                  {hasTemperatureData && mostRecentTemperatureRecord && (
                    <span className="whitespace-nowrap mr-2">
                      Latest: <strong>{mostRecentTemperatureRecord.temperature.toFixed(1)}°C</strong>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center mb-1">
                <button 
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                    }
                  }}
                  className="bg-transparent border-0 p-0 m-0 text-left"
                  type="button"
                  aria-label="Additional temperature ranges"
                >
                  <fieldset 
                    className="flex items-center text-xs border-0 p-0 m-0"
                    aria-label="Additional Temperature Ranges"
                  >
                    <legend className="sr-only">Additional Temperature Ranges</legend>
                    <div className="flex flex-wrap">
                      <span key="temp-legend-moderate" className="mr-2 mb-1">
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#ff9800', marginRight: '4px' }}></span>
                        <span>Moderate fever</span>
                      </span>
                      <span key="temp-legend-high" className="mr-2 mb-1">
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#f44336', marginRight: '4px' }}></span>
                        <span>High fever</span>
                      </span>
                      <span key="temp-legend-vhigh" className="mr-2 mb-1">
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#c62828', marginRight: '4px' }}></span>
                        <span>Very high fever</span>
                      </span>
                    </div>
                  </fieldset>
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Respiratory Rate Card */}
        <Card
          title="Respiratory Rate"
          icon={<Wind size={16} />}
          variant="green"
          headerContent={<RRInfoTooltip />}
          onClick={() => mostRecentRespiratoryRateRecord && hoveredRespiratoryRatePoint && navigateToRecord(hoveredRespiratoryRatePoint.recordId)}
        >
          <div>
            <p className="text-xs text-gray-500 mb-1">Breaths per minute over time</p>
            <button 
              className="h-36 w-full bg-transparent border-0 p-0 text-left" 
              onClick={() => mostRecentRespiratoryRateRecord && hoveredRespiratoryRatePoint && navigateToRecord(hoveredRespiratoryRatePoint.recordId)}
              aria-label="View respiratory rate record details"
              type="button"
              disabled={!mostRecentRespiratoryRateRecord || !hoveredRespiratoryRatePoint}
            >
              {hasRespiratoryRateData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={respiratoryRateChartData}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    style={{ cursor: 'pointer' }}
                    onMouseMove={(data) => {
                      if (data?.activePayload?.[0]?.payload) {
                        setHoveredRespiratoryRatePoint(data.activePayload[0].payload);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="dateValue"
                      type="number"
                      scale="time"
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM d')}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis
                      type="number"
                      domain={[0, 40]}
                      tick={{ fontSize: 10 }}
                      tickCount={5}
                    />
                    <Tooltip 
                      content={TooltipWrapper('respiratoryRate', navigateToRecord)} 
                    />
                    
                    {/* Reference areas for respiratory rate categories */}
                    <ReferenceArea key="rr-area-severe" y1={30} y2={40} fill="#f44336" fillOpacity={0.1} />
                    <ReferenceArea key="rr-area-tachy" y1={20} y2={30} fill="#ff9800" fillOpacity={0.1} />
                    <ReferenceArea key="rr-area-normal" y1={12} y2={20} fill="#4caf50" fillOpacity={0.1} />
                    <ReferenceArea key="rr-area-brady" y1={0} y2={12} fill="#2196f3" fillOpacity={0.1} />
                    
                    {/* Horizontal reference lines at key threshold values */}
                    <ReferenceLine key="rr-line-30" y={30} stroke="#f44336" strokeDasharray="3 3" />
                    <ReferenceLine key="rr-line-20" y={20} stroke="#ff9800" strokeDasharray="3 3" />
                    <ReferenceLine key="rr-line-12" y={12} stroke="#2196f3" strokeDasharray="3 3" />
                    
                    <Line
                      type="monotone"
                      dataKey="respiratoryRate"
                      stroke="#9c27b0"
                      activeDot={{ r: 8, style: { cursor: 'pointer' } }}
                      dot={RespiratoryRateDotWithClickRenderer}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No respiratory rate data available</p>
                </div>
              )}
            </button>
            <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
              <button 
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                  }
                }}
                className="bg-transparent border-0 p-0 m-0 text-left"
                type="button"
                aria-label="Chart legend section"
              >
                <fieldset 
                  className="flex items-center text-xs border-0 p-0 m-0"
                  aria-label="Chart legend"
                >
                  <legend className="sr-only">Chart Legend</legend>
                  <div className="flex flex-wrap">
                    <span key="rr-legend-brady" className="mr-2 mb-1">
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#2196f3', marginRight: '4px' }}></span>
                      <span>Bradypnea: &lt;12</span>
                    </span>
                    <span key="rr-legend-normal" className="mr-2 mb-1">
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#4caf50', marginRight: '4px' }}></span>
                      <span>Normal: 12-20</span>
                    </span>
                    <span key="rr-legend-tachy" className="mr-2 mb-1">
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#ff9800', marginRight: '4px' }}></span>
                      <span>Tachypnea: 20-30</span>
                    </span>
                    <span key="rr-legend-severe" className="mr-2 mb-1">
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#f44336', marginRight: '4px' }}></span>
                      <span>Severe tachypnea: &gt;30</span>
                    </span>
                  </div>
                </fieldset>
              </button>
              <div className="flex items-center">
                {hasRespiratoryRateData && mostRecentRespiratoryRateRecord && (
                  <span className="whitespace-nowrap mr-2">
                    Latest: <strong>{mostRecentRespiratoryRateRecord.respiratoryRate} breaths/min</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
