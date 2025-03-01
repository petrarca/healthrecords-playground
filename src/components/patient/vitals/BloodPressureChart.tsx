import React, { useState, useCallback } from 'react';
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
  ReferenceArea
} from 'recharts';
import { Activity } from 'lucide-react';
import { Card } from '../../ui/card';
import { DotRenderer, TooltipWrapper, DotRendererProps } from './components';
import { BPInfoTooltip } from './InfoTooltips';

interface BloodPressureChartProps {
  data: Array<{
    date: string;
    dateValue: number;
    originalDate: Date;
    systolic: number;
    diastolic: number;
    recordId: string;
  }>;
  navigateToRecord: (recordId: string) => void;
}

export const BloodPressureChart: React.FC<BloodPressureChartProps> = ({ data, navigateToRecord }) => {
  const [selectedBloodPressureRecord, setSelectedBloodPressureRecord] = useState<string | null>(null);
  
  const hasBloodPressureData = data.length > 0;
  const mostRecentBloodPressureRecord = hasBloodPressureData ? data[data.length - 1] : null;
  
  const BloodPressureDotRenderer = useCallback((props: DotRendererProps) => {
    return <DotRenderer {...props} />;
  }, []);

  return (
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
                  data={data}
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
  );
};
