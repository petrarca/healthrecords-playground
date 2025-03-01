import { TooltipProps } from 'recharts';
import { getHeartRateColor, getTemperatureColor, getSystolicColor, getDiastolicColor, getRespiratoryRateColor, getFormattedDate, getHeartRateTooltipData, getBloodPressureTooltipData, getTemperatureTooltipData, getRespiratoryRateTooltipData } from './utils';

// Custom dot renderers for the charts
export interface DotRendererProps {
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

export const DotRenderer = (props: DotRendererProps) => {
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
export type ValueType = string | number | Array<string | number>;
export type NameType = string | number;

// Define the shape of the payload items we expect
export interface TooltipPayloadItem {
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
export interface VitalSignTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  onClick: (recordId: string) => void;
  type: 'heartRate' | 'bloodPressure' | 'temperature' | 'respiratoryRate';
}

// Create a wrapper component to handle the conversion between Recharts tooltip props and our custom component
export const TooltipWrapper = (
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

export const VitalSignTooltip = ({ active, payload, label, onClick, type }: VitalSignTooltipProps) => {
  if (!active || !payload?.length || !payload[0]?.payload) {
    return null;
  }
  
  const data = payload[0].payload;
  const recordId = data.recordId;
  
  if (!recordId) {
    return null;
  }
  
  const formattedDate = getFormattedDate(data, label);
  
  let tooltipData;
  
  switch (type) {
    case 'heartRate':
      if (typeof data.value === 'number') {
        tooltipData = getHeartRateTooltipData(data.value);
      }
      break;
    case 'bloodPressure':
      if (typeof data.systolic === 'number' && typeof data.diastolic === 'number') {
        tooltipData = getBloodPressureTooltipData(data.systolic, data.diastolic);
      }
      break;
    case 'temperature':
      if (typeof data.temperature === 'number') {
        tooltipData = getTemperatureTooltipData(data.temperature);
      }
      break;
    case 'respiratoryRate':
      if (typeof data.respiratoryRate === 'number') {
        tooltipData = getRespiratoryRateTooltipData(data.respiratoryRate);
      }
      break;
  }
  
  if (!tooltipData) {
    return null;
  }
  
  return (
    <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md text-xs">
      <div className="font-medium">{formattedDate}</div>
      <div className="mt-1">
        <span className="font-medium">{tooltipData.displayValue}</span> {tooltipData.unit}
      </div>
      <div className="mt-1">
        Status: <span style={{ color: tooltipData.statusColor, fontWeight: 'bold' }}>{tooltipData.status}</span>
      </div>
      <button 
        className="mt-1 text-blue-600 cursor-pointer bg-transparent border-0 p-0 text-left"
        onClick={() => onClick(recordId)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick(recordId);
          }
        }}
      >
        View details
      </button>
    </div>
  );
};
