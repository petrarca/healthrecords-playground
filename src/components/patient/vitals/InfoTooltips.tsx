import React, { useState } from 'react';
import { Info } from 'lucide-react';

const TooltipContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="absolute z-10 w-64 p-3 text-xs bg-white border border-gray-200 rounded-md shadow-lg right-0 mt-1">
      {children}
    </div>
  );
};

export const BPInfoTooltip: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <div className="relative">
      <button
        aria-label="Blood pressure information"
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          setShowInfo(!showInfo);
        }}
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      >
        <Info size={14} />
      </button>
      
      {showInfo && (
        <TooltipContent>
          <h4 className="font-medium mb-1">Blood Pressure Categories</h4>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <span className="font-medium">Normal:</span> Systolic &lt; 120 mmHg and Diastolic &lt; 80 mmHg
            </li>
            <li>
              <span className="font-medium">Elevated:</span> Systolic 120-129 mmHg and Diastolic &lt; 80 mmHg
            </li>
            <li>
              <span className="font-medium">Stage 1 Hypertension:</span> Systolic 130-139 mmHg or Diastolic 80-89 mmHg
            </li>
            <li>
              <span className="font-medium">Stage 2 Hypertension:</span> Systolic ≥ 140 mmHg or Diastolic ≥ 90 mmHg
            </li>
            <li>
              <span className="font-medium">Hypertensive Crisis:</span> Systolic &gt; 180 mmHg and/or Diastolic &gt; 120 mmHg
            </li>
          </ul>
        </TooltipContent>
      )}
    </div>
  );
};

export const HRInfoTooltip: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <div className="relative">
      <button
        aria-label="Heart rate information"
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          setShowInfo(!showInfo);
        }}
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      >
        <Info size={14} />
      </button>
      
      {showInfo && (
        <TooltipContent>
          <h4 className="font-medium mb-1">Heart Rate Categories (Adults)</h4>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <span className="font-medium">Bradycardia:</span> &lt; 60 beats per minute (BPM)
            </li>
            <li>
              <span className="font-medium">Normal:</span> 60-100 beats per minute (BPM)
            </li>
            <li>
              <span className="font-medium">Tachycardia:</span> &gt; 100 beats per minute (BPM)
            </li>
          </ul>
          <p className="mt-2 text-gray-600">
            Note: Athletes and physically active individuals may have a lower resting heart rate.
          </p>
        </TooltipContent>
      )}
    </div>
  );
};

export const TempInfoTooltip: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <div className="relative">
      <button
        aria-label="Temperature information"
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          setShowInfo(!showInfo);
        }}
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      >
        <Info size={14} />
      </button>
      
      {showInfo && (
        <TooltipContent>
          <h4 className="font-medium mb-1">Body Temperature Categories</h4>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <span className="font-medium">Hypothermia:</span> &lt; 36.0°C (96.8°F)
            </li>
            <li>
              <span className="font-medium">Normal:</span> 36.0-37.5°C (96.8-99.5°F)
            </li>
            <li>
              <span className="font-medium">Low-grade Fever:</span> 37.5-38.0°C (99.5-100.4°F)
            </li>
            <li>
              <span className="font-medium">Moderate Fever:</span> 38.0-39.0°C (100.4-102.2°F)
            </li>
            <li>
              <span className="font-medium">High Fever:</span> 39.0-40.0°C (102.2-104.0°F)
            </li>
            <li>
              <span className="font-medium">Very High Fever:</span> &gt; 40.0°C (104.0°F)
            </li>
          </ul>
        </TooltipContent>
      )}
    </div>
  );
};

export const RRInfoTooltip: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <div className="relative">
      <button
        aria-label="Respiratory rate information"
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          setShowInfo(!showInfo);
        }}
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      >
        <Info size={14} />
      </button>
      
      {showInfo && (
        <TooltipContent>
          <h4 className="font-medium mb-1">Respiratory Rate Categories (Adults)</h4>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <span className="font-medium">Low:</span> &lt; 12 breaths per minute
            </li>
            <li>
              <span className="font-medium">Normal:</span> 12-20 breaths per minute
            </li>
            <li>
              <span className="font-medium">High:</span> 20-25 breaths per minute
            </li>
            <li>
              <span className="font-medium">Very High:</span> &gt; 25 breaths per minute
            </li>
          </ul>
          <p className="mt-2 text-gray-600">
            Note: Respiratory rate can be affected by exercise, illness, and anxiety.
          </p>
        </TooltipContent>
      )}
    </div>
  );
};
