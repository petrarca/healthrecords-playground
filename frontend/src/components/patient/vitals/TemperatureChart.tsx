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
import { Thermometer } from 'lucide-react';
import { Card } from '../../ui/card';
import { DotRenderer, TooltipWrapper, DotRendererProps } from './components';
import { TempInfoTooltip } from './InfoTooltips';

interface TemperatureChartProps {
  data: Array<{
    date: string;
    dateValue: number;
    originalDate: Date;
    temperature: number;
    recordId: string;
  }>;
  navigateToRecord: (recordId: string) => void;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ data, navigateToRecord }) => {
  const [selectedTemperatureRecord, setSelectedTemperatureRecord] = useState<string | null>(null);
  
  const hasTemperatureData = data.length > 0;
  const mostRecentTemperatureRecord = hasTemperatureData ? data[data.length - 1] : null;
  
  const TemperatureDotWithClickRenderer = useCallback((props: DotRendererProps) => {
    return <DotRenderer {...props} onClick={navigateToRecord} />;
  }, [navigateToRecord]);

  return (
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
                  data={data}
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
                    isAnimationActive={false}
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
  );
};
