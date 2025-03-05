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
import { Wind } from 'lucide-react';
import { Card } from '../../ui/card';
import { DotRenderer, TooltipWrapper, DotRendererProps } from './components';
import { RRInfoTooltip } from './InfoTooltips';

interface RespiratoryRateChartProps {
  data: Array<{
    date: string;
    dateValue: number;
    originalDate: Date;
    respiratoryRate: number;
    recordId: string;
  }>;
  navigateToRecord: (recordId: string) => void;
}

export const RespiratoryRateChart: React.FC<RespiratoryRateChartProps> = ({ data, navigateToRecord }) => {
  const [selectedRespiratoryRateRecord, setSelectedRespiratoryRateRecord] = useState<string | null>(null);
  
  const hasRespiratoryRateData = data.length > 0;
  const mostRecentRespiratoryRateRecord = hasRespiratoryRateData ? data[data.length - 1] : null;
  
  const RespiratoryRateDotWithClickRenderer = useCallback((props: DotRendererProps) => {
    return <DotRenderer {...props} onClick={navigateToRecord} />;
  }, [navigateToRecord]);

  return (
    <Card
      title="Respiratory Rate"
      icon={<Wind size={16} />}
      variant="green"
      headerContent={<RRInfoTooltip />}
      onClick={() => mostRecentRespiratoryRateRecord && navigateToRecord(mostRecentRespiratoryRateRecord.recordId)}
    >
      <div>
        <p className="text-xs text-gray-500 mb-1">Breaths per minute over time</p>
        
        <div className="h-36 w-full mt-1">
          {hasRespiratoryRateData ? (
            <button 
              className="w-full h-full cursor-pointer" 
              onClick={() => {
                if (selectedRespiratoryRateRecord) {
                  navigateToRecord(selectedRespiratoryRateRecord);
                } else if (mostRecentRespiratoryRateRecord) {
                  navigateToRecord(mostRecentRespiratoryRateRecord.recordId);
                }
              }}
              aria-label="View respiratory rate record details"
              disabled={!selectedRespiratoryRateRecord && !mostRecentRespiratoryRateRecord}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  style={{ cursor: 'pointer' }}
                  onMouseMove={(data) => {
                    if (data?.activePayload?.[0]?.payload?.recordId) {
                      setSelectedRespiratoryRateRecord(data.activePayload[0].payload.recordId);
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
                    domain={[8, 30]} 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    content={TooltipWrapper('respiratoryRate', navigateToRecord)} 
                  />
                  
                  {/* Color-coded reference areas for respiratory rate categories */}
                  <ReferenceArea key="rr-area-very-high" y1={25} y2={30} fill="#c62828" fillOpacity={0.1} /> {/* Very high */}
                  <ReferenceArea key="rr-area-high" y1={20} y2={25} fill="#f44336" fillOpacity={0.1} /> {/* High */}
                  <ReferenceArea key="rr-area-normal" y1={12} y2={20} fill="#4caf50" fillOpacity={0.1} /> {/* Normal */}
                  <ReferenceArea key="rr-area-low" y1={8} y2={12} fill="#2196f3" fillOpacity={0.1} /> {/* Low */}
                  
                  {/* Horizontal reference lines at key threshold values */}
                  <ReferenceLine key="rr-line-25" y={25} stroke="#c62828" strokeDasharray="3 3" />
                  <ReferenceLine key="rr-line-20" y={20} stroke="#f44336" strokeDasharray="3 3" />
                  <ReferenceLine key="rr-line-12" y={12} stroke="#2196f3" strokeDasharray="3 3" />
                  
                  <Line
                    type="monotone" 
                    dataKey="respiratoryRate" 
                    stroke="#4caf50" 
                    dot={RespiratoryRateDotWithClickRenderer}
                    activeDot={{ r: 8, style: { cursor: 'pointer' } }}
                    style={{ cursor: 'pointer' }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </button>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No respiratory rate data available</p>
            </div>
          )}
        </div>
        
        <div className="mt-1 text-xs text-gray-500 flex justify-between items-center">
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
                <span key="rr-legend-low" className="mr-2 mb-1">
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#2196f3', marginRight: '4px' }}></span>
                  <span>Low: &lt;12 breaths/min</span>
                </span>
                <span key="rr-legend-normal" className="mr-2 mb-1">
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#4caf50', marginRight: '4px' }}></span>
                  <span>Normal: 12-20 breaths/min</span>
                </span>
                <span key="rr-legend-high" className="mr-2 mb-1">
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#f44336', marginRight: '4px' }}></span>
                  <span>High: 20-25 breaths/min</span>
                </span>
                <span key="rr-legend-very-high" className="mr-2 mb-1">
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#c62828', marginRight: '4px' }}></span>
                  <span>Very high: &gt;25 breaths/min</span>
                </span>
              </div>
            </fieldset>
          </button>
          {hasRespiratoryRateData && mostRecentRespiratoryRateRecord && (
            <span className="whitespace-nowrap">
              Latest: <strong>{mostRecentRespiratoryRateRecord.respiratoryRate} breaths/min</strong>
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
