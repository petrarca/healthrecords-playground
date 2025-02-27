import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '../hooks/useAppContext';

export const ContextDisplay: React.FC = () => {
  const { state } = useAppContext();
  const [position, setPosition] = useState({ x: window.innerWidth - 200, y: window.innerHeight - 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const displayRef = useRef<HTMLDivElement>(null);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (displayRef.current) {
      const rect = displayRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  }, [isDragging, dragOffset]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, handleMouseMove, handleMouseUp]);
  
  // Only render when debug mode is enabled
  if (!state.debugMode) return null;
  
  return (
    <div 
      ref={displayRef}
      className="absolute bg-blue-100 text-blue-800 p-2 rounded-md text-xs z-50 shadow-md cursor-move"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        userSelect: 'none',
        border: '1px solid #93c5fd'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="font-semibold mb-1 flex justify-between items-center">
        <span>Context Information</span>
        <span className="text-xs text-blue-600 ml-2">Debug Mode: Enabled</span>
      </div>
      <div>Current View: {state.currentView}</div>
      <div>
        Current Patient: {state.currentPatient 
          ? `${state.currentPatient.firstName} ${state.currentPatient.lastName}` 
          : 'None'}
      </div>
      {state.currentPatient && (
        <>
          <div>ID: {state.currentPatient.id}</div>
          <div>Patient ID: {state.currentPatient.patientId}</div>
        </>
      )}
      {state.currentRecordId && (
        <div>Current Record: {state.currentRecordId}</div>
      )}
    </div>
  );
};
