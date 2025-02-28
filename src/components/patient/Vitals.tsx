import { format, subDays } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  ScatterChart,
  Scatter,
  ZAxis,
  TooltipProps as RechartsTooltipProps
} from 'recharts';
import { Patient } from '../../types/types';
import { MedicalRecord, MedicalRecordType } from '../../types/medicalRecord';
import { Card } from '../ui/Card';
import { Heart, Activity, Thermometer, Wind } from 'lucide-react';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface VitalsProps {
  readonly patient: Patient;
}

// Helper functions for generating vital data
const generateHeartRate = (dayOffset: number): number => {
  if (dayOffset === 24) {
    // High heart rate (above 100)
    return 110 + Math.round(Math.random() * 15); // 110-125
  } else if (dayOffset === 12) {
    // Low heart rate (below 60)
    return 45 + Math.round(Math.random() * 10); // 45-55
  } else {
    // Normal range with variation
    const baseHeartRate = 75;
    const variation = Math.sin(dayOffset * 0.5) * 15;
    return Math.round(baseHeartRate + variation);
  }
};

const generateBloodPressure = (dayOffset: number): { systolic: number; diastolic: number } => {
  if (dayOffset === 20) {
    // High blood pressure (hypertension)
    return {
      systolic: 145 + Math.round(Math.random() * 15), // 145-160
      diastolic: 95 + Math.round(Math.random() * 10), // 95-105
    };
  } else if (dayOffset === 8) {
    // Low blood pressure (hypotension)
    return {
      systolic: 85 + Math.round(Math.random() * 10), // 85-95
      diastolic: 50 + Math.round(Math.random() * 10), // 50-60
    };
  } else {
    // Normal range with variation
    const baseSystolic = 120;
    const baseDiastolic = 80;
    const variation = Math.sin(dayOffset * 0.5) * 10;
    return {
      systolic: Math.round(baseSystolic + variation),
      diastolic: Math.round(baseDiastolic + variation * 0.6),
    };
  }
};

const generateTemperature = (dayOffset: number): number | undefined => {
  if (dayOffset % 6 !== 0) return undefined;
  
  if (dayOffset === 18) {
    // Fever
    return 38.2 + (Math.random() * 0.8); // 38.2-39.0
  } else if (dayOffset === 6) {
    // Low temperature
    return 35.5 + (Math.random() * 0.5); // 35.5-36.0
  } else {
    // Normal range
    return 36.5 + (Math.random() * 0.7); // 36.5-37.2
  }
};

const generateRespiratoryRate = (dayOffset: number): number | undefined => {
  if (dayOffset % 5 !== 0) return undefined;
  
  if (dayOffset === 10) {
    // High respiratory rate
    return 22 + Math.round(Math.random() * 8); // 22-30
  } else if (dayOffset === 20) {
    // Low respiratory rate
    return 8 + Math.round(Math.random() * 3); // 8-11
  } else {
    // Normal range
    return 14 + Math.round(Math.random() * 4); // 14-18
  }
};

// Generate dummy heart rate and blood pressure data for the past 30 days
const generateDummyVitalData = (patientId: string): MedicalRecord[] => {
  const records: MedicalRecord[] = [];
  const now = new Date();
  
  // Generate data points for the last 30 days
  for (let i = 30; i >= 0; i -= 2) {
    const date = subDays(now, i);
    
    // Generate vital signs
    const heartRate = generateHeartRate(i);
    const { systolic, diastolic } = generateBloodPressure(i);
    const temperature = generateTemperature(i);
    const respiratoryRate = generateRespiratoryRate(i);
    
    records.push({
      id: `vital-${i}`,
      patientId,
      recordId: `vital-${i}`,
      recordedAt: date,
      recordType: MedicalRecordType.VITAL_SIGNS,
      title: 'Routine Vital Signs Check',
      description: 'Regular monitoring of vital signs',
      details: {
        heart_rate: heartRate,
        blood_pressure: `${systolic}/${diastolic}`,
        ...(temperature !== undefined ? { temperature } : {}),
        ...(respiratoryRate !== undefined ? { respiratory_rate: respiratoryRate } : {})
      }
    });
  }
  
  return records;
};

// Custom tooltip for blood pressure
const BloodPressureTooltip = ({ active, payload, label }: RechartsTooltipProps<ValueType, NameType>) => {
  if (active && payload?.length) {
    const systolic = payload[0].payload?.systolic as number;
    const diastolic = payload[0].payload?.diastolic as number;
    
    let systolicStatus = "Normal";
    let diastolicStatus = "Normal";
    let systolicColor = "#4caf50"; // Green
    let diastolicColor = "#4caf50"; // Green
    
    // Check systolic
    if (systolic >= 140) {
      systolicStatus = "High";
      systolicColor = "#f44336"; // Red
    } else if (systolic < 90) {
      systolicStatus = "Low";
      systolicColor = "#2196f3"; // Blue
    }
    
    // Check diastolic
    if (diastolic >= 90) {
      diastolicStatus = "High";
      diastolicColor = "#f44336"; // Red
    } else if (diastolic < 60) {
      diastolicStatus = "Low";
      diastolicColor = "#2196f3"; // Blue
    }
    
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-semibold text-gray-800">{`Date: ${label}`}</p>
        <p>
          <span style={{ color: systolicColor }} className="font-medium">{`Systolic: ${systolic} mmHg (${systolicStatus})`}</span>
        </p>
        <p>
          <span style={{ color: diastolicColor }} className="font-medium">{`Diastolic: ${diastolic} mmHg (${diastolicStatus})`}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Custom tooltip for temperature
const TemperatureInlineTooltip = ({ active, payload }: RechartsTooltipProps<ValueType, NameType>) => {
  if (active && payload?.length) {
    const temperature = payload[0].value as number;
    let status = "Normal";
    let statusColor = "#4caf50"; // Green
    
    if (temperature >= 37.5) {
      status = "Fever";
      statusColor = "#f44336"; // Red
    } else if (temperature < 36.1) {
      status = "Low";
      statusColor = "#2196f3"; // Blue
    }
    
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-sm rounded">
        <p className="font-medium">{`Date: ${payload[0].payload.formattedDate}`}</p>
        <p className="text-blue-600">{`Temperature: ${temperature.toFixed(1)}°C`}</p>
        <p style={{ color: statusColor }}>{`Status: ${status}`}</p>
      </div>
    );
  }
  return null;
};

// Custom tooltip for respiratory rate
const RespiratoryRateInlineTooltip = ({ active, payload }: RechartsTooltipProps<ValueType, NameType>) => {
  if (active && payload?.length) {
    const respiratoryRate = payload[0].value as number;
    let status = "Normal";
    let statusColor = "#4caf50"; // Green
    
    if (respiratoryRate > 20) {
      status = "Elevated";
      statusColor = "#ff9800"; // Orange
    } else if (respiratoryRate < 12) {
      status = "Low";
      statusColor = "#2196f3"; // Blue
    }
    
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-sm rounded">
        <p className="font-medium">{`Date: ${payload[0].payload.formattedDate}`}</p>
        <p className="text-green-600">{`Respiratory Rate: ${respiratoryRate} breaths/min`}</p>
        <p style={{ color: statusColor }}>{`Status: ${status}`}</p>
      </div>
    );
  }
  return null;
};

// Heart Rate inline tooltip component
const HeartRateInlineTooltip = ({ active, payload }: RechartsTooltipProps<ValueType, NameType>) => {
  if (active && payload?.length) {
    const heartRate = payload[0].value as number;
    let status = "Normal";
    let statusColor = "#4caf50"; // Green
    
    if (heartRate > 100) {
      status = "Elevated";
      statusColor = "#ff9800"; // Orange
    } else if (heartRate < 60) {
      status = "Low";
      statusColor = "#2196f3"; // Blue
    }
    
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-sm rounded">
        <p className="font-medium">{`Date: ${payload[0].payload.formattedDate}`}</p>
        <p className="text-purple-600">{`Heart Rate: ${heartRate} BPM`}</p>
        <p style={{ color: statusColor }}>{`Status: ${status}`}</p>
      </div>
    );
  }
  return null;
};

// Define a proper interface for the BloodPressureShape props
interface BloodPressureShapeProps {
  readonly cx?: number;
  readonly cy?: number;
  readonly payload?: {
    readonly systolic: number;
    readonly diastolic: number;
    readonly [key: string]: unknown;
  };
  readonly index?: number;
  readonly yAxis?: {
    readonly scale: (value: number) => number;
  };
  readonly strokeWidth?: number;
}

// Helper functions for color determination
const getSystolicColor = (value: number): string => {
  if (value >= 140) return "#f44336"; // Red
  if (value < 90) return "#2196f3"; // Blue
  return "#4caf50"; // Green
};

const getDiastolicColor = (value: number): string => {
  if (value >= 90) return "#f44336"; // Red
  if (value < 60) return "#2196f3"; // Blue
  return "#4caf50"; // Green
};

// Custom shape for blood pressure visualization
const BloodPressureShape = (props: unknown): React.ReactElement => {
  // Cast the unknown props to our expected shape
  const typedProps = props as BloodPressureShapeProps;
  
  if (!typedProps.cx || !typedProps.payload || !typedProps.yAxis) {
    // Return an empty SVG element instead of null to satisfy the type requirements
    return <g></g>;
  }
  
  const { cx, payload, yAxis, strokeWidth = 2 } = typedProps;
  const { systolic, diastolic } = payload;
  
  // Calculate y positions based on the actual values
  const systolicY = yAxis.scale(systolic);
  const diastolicY = yAxis.scale(diastolic);
  
  // Determine line color based on values
  const lineColor = (systolic >= 140 || diastolic >= 90 || systolic < 90 || diastolic < 60) 
    ? "#ff9800" 
    : "#4caf50";
  
  return (
    <g>
      {/* Vertical line from systolic to diastolic */}
      <line 
        x1={cx} 
        y1={systolicY} 
        x2={cx} 
        y2={diastolicY} 
        stroke={lineColor} 
        strokeWidth={strokeWidth} 
      />
      
      {/* Horizontal bar for systolic */}
      <line
        x1={cx - 5}
        y1={systolicY}
        x2={cx + 5}
        y2={systolicY}
        stroke={getSystolicColor(systolic)}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      
      {/* Horizontal bar for diastolic */}
      <line
        x1={cx - 5}
        y1={diastolicY}
        x2={cx + 5}
        y2={diastolicY}
        stroke={getDiastolicColor(diastolic)}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </g>
  );
};

// Add this function to determine point color based on temperature
const getTemperatureColor = (temp: number) => {
  if (temp >= 37.5) return "#ff5722"; // Orange-red for high/fever
  if (temp < 36.1) return "#2196f3";  // Blue for low
  return "#2196f3";  // Normal blue
};

// Add this function to determine point color based on respiratory rate
const getRespiratoryRateColor = (rate: number) => {
  if (rate > 20) return "#ff5722"; // Orange-red for high
  if (rate < 12) return "#2196f3";  // Blue for low
  return "#4caf50";  // Normal green
};

// Custom dot for heart rate
interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: {
    value?: number;
    temperature?: number;
    respiratoryRate?: number;
    [key: string]: unknown;
  };
  index?: number;
}

const HeartRateDot = (props: CustomDotProps) => {
  if (!props.cx || !props.cy || !props.payload) {
    return null;
  }
  
  const { cx, cy, payload, index } = props;
  const heartRate = payload.value ?? 0;
  let color = "#4caf50"; // Normal (green)
  
  if (heartRate > 100) {
    color = "#f44336"; // High (red)
  } else if (heartRate < 60) {
    color = "#2196f3"; // Low (blue)
  }
  
  return (
    <circle 
      key={`heart-rate-dot-${index}`}
      cx={cx} 
      cy={cy} 
      r={4} 
      fill={color} 
      stroke="#fff"
      strokeWidth="1"
    />
  );
};

// Custom dot for temperature
const TemperatureDot = (props: CustomDotProps) => {
  if (!props.cx || !props.cy || !props.payload) {
    return null;
  }
  
  const { cx, cy, payload, index } = props;
  const temperature = payload.temperature ?? 36.5; // Default to normal temperature if undefined
  const color = getTemperatureColor(temperature);
  
  return (
    <circle 
      key={`temperature-dot-${index}`}
      cx={cx} 
      cy={cy} 
      r={4} 
      fill={color} 
      stroke="#fff"
      strokeWidth="1"
    />
  );
};

// Custom dot for respiratory rate
const RespiratoryRateDot = (props: CustomDotProps) => {
  if (!props.cx || !props.cy || !props.payload) {
    return null;
  }
  
  const { cx, cy, payload, index } = props;
  const respiratoryRate = payload.respiratoryRate ?? 16; // Default to normal respiratory rate if undefined
  const color = getRespiratoryRateColor(respiratoryRate);
  
  return (
    <circle 
      key={`respiratory-rate-dot-${index}`}
      cx={cx} 
      cy={cy} 
      r={4} 
      fill={color} 
      stroke="#fff"
      strokeWidth="1"
    />
  );
};

export function Vitals({ patient }: VitalsProps) {
  const [vitalRecords, setVitalRecords] = useState<MedicalRecord[]>([]);
  
  useEffect(() => {
    if (patient) {
      const dummyData = generateDummyVitalData(patient.id);
      console.log('Generated dummy data:', dummyData);
      setVitalRecords(dummyData);
    }
  }, [patient]);
  
  // Create a simple array of heart rate data points
  const heartRateData = vitalRecords
    .filter(record => {
      console.log('Checking record for heart_rate:', record.details);
      return record.details?.heart_rate !== undefined;
    })
    .map(record => ({
      id: record.recordId,
      date: record.recordedAt,
      formattedDate: format(record.recordedAt, 'MMM dd'),
      value: record.details?.heart_rate as number
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  console.log('Heart rate data:', heartRateData);
  
  // Transform the data for the blood pressure chart
  const bloodPressureChartData = vitalRecords
    .filter(record => record.details?.blood_pressure)
    .map(record => {
      // Parse blood pressure from the "systolic/diastolic" format
      const bpParts = (record.details?.blood_pressure as string).split('/');
      const systolic = parseInt(bpParts[0], 10);
      const diastolic = parseInt(bpParts[1], 10);
      
      return {
        date: format(record.recordedAt, 'MMM dd'),
        dateValue: record.recordedAt.getTime(),
        systolic,
        diastolic,
        recordId: record.recordId
      };
    });

  // Transform the data for temperature chart
  const temperatureChartData = vitalRecords
    .filter(record => record.details?.temperature)
    .map(record => ({
      date: format(record.recordedAt, 'MMM dd'),
      temperature: record.details?.temperature as number
    }));

  // Transform the data for respiratory rate chart
  const respiratoryRateChartData = vitalRecords
    .filter(record => record.details?.respiratory_rate)
    .map(record => ({
      date: format(record.recordedAt, 'MMM dd'),
      respiratoryRate: record.details?.respiratory_rate as number
    }));

  console.log('Respiratory rate data:', respiratoryRateChartData);

  if (!patient) return null;

  // Check if we have any data to display
  const hasBloodPressureData = bloodPressureChartData.length > 0;
  const hasTemperatureData = temperatureChartData.length > 0;
  const hasRespiratoryRateData = respiratoryRateChartData.length > 0;

  return (
    <div className="w-full space-y-2 overflow-auto max-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Heart Rate Card */}
        <Card
          title="Heart Rate"
          icon={<Heart size={16} />}
          variant="purple"
        >
          <div className="w-full">
            <p className="text-xs text-gray-500 mb-1">Beats per minute (BPM) over time</p>
            
            <div className="h-36 w-full mt-2">
              {heartRateData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={heartRateData}
                    margin={{
                      top: 5,
                      right: 15,
                      left: 10,
                      bottom: 15
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="formattedDate" 
                      tick={{ fontSize: 8 }} 
                      tickMargin={8}
                      stroke="#666"
                    />
                    <YAxis 
                      domain={[40, 160]} 
                      tick={{ fontSize: 8 }} 
                      stroke="#666"
                      label={{ 
                        value: 'BPM', 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle', fill: '#666', fontSize: 8 }
                      }}
                    />
                    <Tooltip 
                      content={<HeartRateInlineTooltip />}
                    />
                    <defs>
                      <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={<HeartRateDot />}
                      activeDot={{ r: 6 }}
                    />
                    <ReferenceLine 
                      y={100} 
                      stroke="#f44336" 
                      strokeDasharray="5 5"
                    />
                    <ReferenceLine 
                      y={60} 
                      stroke="#2196f3" 
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <p className="text-gray-400 text-sm">No heart rate data available</p>
                </div>
              )}
            </div>
            
            <div className="mt-2 text-xs text-gray-500 flex justify-between">
              <span>Normal range: 60-100 BPM</span>
              {heartRateData.length > 0 && (
                <span>
                  Latest: <strong>{heartRateData[heartRateData.length - 1].value} BPM</strong>
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
        >
          <div>
            <p className="text-xs text-gray-500 mb-1">Systolic/Diastolic pressure (mmHg) over time</p>
            <div className="h-36 w-full mt-1">
              {hasBloodPressureData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{
                      top: 5,
                      right: 15,
                      left: 10,
                      bottom: 15
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="dateValue" 
                      tick={{ fontSize: 8 }} 
                      tickMargin={8}
                      stroke="#666"
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return format(date, 'MMM dd');
                      }}
                    />
                    <YAxis 
                      domain={[40, 180]} 
                      tick={{ fontSize: 8 }}
                      stroke="#666"
                      label={{ 
                        value: 'mmHg', 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle', fill: '#666', fontSize: 8 }
                      }}
                    />
                    <ZAxis range={[0, 0]} />
                    <Tooltip content={<BloodPressureTooltip />} />
                    
                    <Scatter
                      name="Blood Pressure"
                      data={bloodPressureChartData}
                      fill="#8884d8"
                      shape={BloodPressureShape as unknown as (props: unknown) => React.ReactElement}
                      legendType="none"
                      isAnimationActive={false}
                    />
                    
                    <ReferenceLine 
                      y={140} 
                      stroke="#f44336" 
                      strokeDasharray="3 3"
                    />
                    <ReferenceLine 
                      y={90} 
                      stroke="#f44336" 
                      strokeDasharray="3 3"
                    />
                    <ReferenceLine 
                      y={60} 
                      stroke="#2196f3" 
                      strokeDasharray="3 3"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No blood pressure data available</p>
                </div>
              )}
            </div>
            <div className="mt-1 text-xs text-gray-500 flex justify-between">
              <span>Normal blood pressure: Below 120/80 mmHg</span>
              {hasBloodPressureData && (
                <span>
                  Latest: <strong>{bloodPressureChartData[bloodPressureChartData.length - 1].systolic}/{bloodPressureChartData[bloodPressureChartData.length - 1].diastolic} mmHg</strong>
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Temperature Card */}
        <Card
          title="Temperature"
          icon={<Thermometer size={16} />}
          variant="blue"
        >
          <div>
            <p className="text-xs text-gray-500 mb-1">Body temperature (°C) over time</p>
            <div className="h-36 w-full mt-1">
              {hasTemperatureData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={temperatureChartData}
                    margin={{
                      top: 5,
                      right: 15,
                      left: 10,
                      bottom: 15
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 8 }} 
                      tickMargin={8}
                      stroke="#666"
                    />
                    <YAxis 
                      domain={[35, 40]} 
                      tick={{ fontSize: 8 }}
                      stroke="#666"
                      label={{ 
                        value: '°C', 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle', fill: '#666', fontSize: 8 }
                      }}
                    />
                    <Tooltip 
                      content={<TemperatureInlineTooltip />}
                    />
                    <defs>
                      <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2196f3" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2196f3" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <Line 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#2196f3" 
                      strokeWidth={2}
                      dot={<TemperatureDot />}
                      activeDot={{ r: 6 }}
                    />
                    <ReferenceLine 
                      y={37.5} 
                      stroke="#f44336" 
                      strokeDasharray="5 5"
                    />
                    <ReferenceLine 
                      y={36.1} 
                      stroke="#2196f3" 
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No temperature data available</p>
                </div>
              )}
            </div>
            <div className="mt-1 text-xs text-gray-500 flex justify-between">
              <span>Normal body temperature: 36.1-37.2°C</span>
              {hasTemperatureData && (
                <span>
                  Latest: <strong>{temperatureChartData[temperatureChartData.length - 1].temperature.toFixed(1)}°C</strong>
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Respiratory Rate Card */}
        <Card
          title="Respiratory Rate"
          icon={<Wind size={16} />}
          variant="green"
        >
          <div>
            <p className="text-xs text-gray-500 mb-1">Breaths per minute over time</p>
            <div className="h-36 w-full mt-1">
              {hasRespiratoryRateData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={respiratoryRateChartData}
                    margin={{
                      top: 5,
                      right: 15,
                      left: 10,
                      bottom: 15
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 8 }} 
                      tickMargin={8}
                      stroke="#666"
                    />
                    <YAxis 
                      domain={[5, 35]} 
                      tick={{ fontSize: 8 }}
                      stroke="#666"
                      label={{ 
                        value: 'breaths/min', 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle', fill: '#666', fontSize: 8 }
                      }}
                    />
                    <Tooltip 
                      content={<RespiratoryRateInlineTooltip />}
                    />
                    <defs>
                      <linearGradient id="respiratoryRateGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4caf50" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <Line 
                      type="monotone" 
                      dataKey="respiratoryRate" 
                      stroke="#4caf50" 
                      strokeWidth={2}
                      dot={<RespiratoryRateDot />}
                      activeDot={{ r: 6 }}
                    />
                    <ReferenceLine 
                      y={20} 
                      stroke="#f44336" 
                      strokeDasharray="5 5"
                    />
                    <ReferenceLine 
                      y={12} 
                      stroke="#2196f3" 
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No respiratory rate data available</p>
                </div>
              )}
            </div>
            <div className="mt-1 text-xs text-gray-500 flex justify-between">
              <span>Normal respiratory rate: 12-20 breaths per minute</span>
              {hasRespiratoryRateData && (
                <span>
                  Latest: <strong>{respiratoryRateChartData[respiratoryRateChartData.length - 1].respiratoryRate} breaths/min</strong>
                </span>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
