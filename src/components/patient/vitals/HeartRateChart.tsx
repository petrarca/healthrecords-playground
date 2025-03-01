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
import { Heart } from 'lucide-react';
import { Card } from '../../ui/card';
import { DotRenderer, TooltipWrapper, DotRendererProps } from './components';
import { HRInfoTooltip } from './InfoTooltips';

interface HeartRateChartProps {
  data: Array<{
    date: string;
    dateValue: number;
    originalDate: Date;
    value: number;
    recordId: string;
  }>;
  navigateToRecord: (recordId: string) => void;
}

export const HeartRateChart: React.FC<HeartRateChartProps> = ({ data, navigateToRecord }) => {
  const [selectedHeartRateRecord, setSelectedHeartRateRecord] = useState<string | null>(null);
  
  const mostRecentHeartRateRecord = data.length > 0 ? data[data.length - 1] : null;
  
  const HeartRateDotWithClickRenderer = useCallback((props: DotRendererProps) => {
    return <DotRenderer {...props} onClick={navigateToRecord} />;
  }, [navigateToRecord]);

  return (
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
          {data.length > 0 ? (
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
                  data={data}
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
                    isAnimationActive={false}
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
          {data.length > 0 && mostRecentHeartRateRecord && (
            <span className="mr-2">
              Latest: <strong>{mostRecentHeartRateRecord.value} BPM</strong>
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
