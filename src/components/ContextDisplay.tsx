import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '../hooks/useAppContext';

export const ContextDisplay: React.FC = () => {
  const { state, toggleDebugMode } = useAppContext();
  const [position, setPosition] = useState({ x: window.innerWidth - 200, y: window.innerHeight - 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const displayRef = useRef<HTMLDialogElement>(null);
  
  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (displayRef.current) {
      const rect = displayRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      e.preventDefault(); // Prevent text selection during drag
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    if (displayRef.current && e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = displayRef.current.getBoundingClientRect();
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
      setIsDragging(true);
      e.preventDefault(); // Prevent scrolling during drag
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

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragOffset.x,
        y: touch.clientY - dragOffset.y
      });
      e.preventDefault(); // Prevent scrolling during drag
    }
  }, [isDragging, dragOffset]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      document.addEventListener('touchcancel', handleTouchEnd);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDragging, dragOffset, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Escape') {
      toggleDebugMode();
    } else if (e.key === 'ArrowUp') {
      setPosition(prev => ({ ...prev, y: prev.y - 10 }));
    } else if (e.key === 'ArrowDown') {
      setPosition(prev => ({ ...prev, y: prev.y + 10 }));
    } else if (e.key === 'ArrowLeft') {
      setPosition(prev => ({ ...prev, x: prev.x - 10 }));
    } else if (e.key === 'ArrowRight') {
      setPosition(prev => ({ ...prev, x: prev.x + 10 }));
    }
  };
  
  // Only render when debug mode is enabled
  if (!state.debugMode) return null;
  
  return (
    <dialog
      ref={displayRef}
      className="absolute bg-blue-100 text-blue-800 p-2 rounded-md text-xs z-50 shadow-md"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        userSelect: 'none',
        border: '1px solid #93c5fd',
        margin: 0,
        padding: '0.5rem',
        inset: 'unset' // Override default dialog positioning
      }}
      open={true}
      aria-labelledby="context-display-title"
    >
      <button 
        className="handle w-full cursor-move bg-blue-200 rounded-t-sm px-2 py-1 mb-1 text-left" 
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        aria-label="Drag context panel, use arrow keys to move"
      >
        <div className="font-semibold mb-1 flex justify-between items-center">
          <span id="context-display-title">Context Information</span>
          <div className="flex items-center">
            <span className="text-xs text-blue-600 mr-2">Debug Mode: Enabled</span>
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent dragging when clicking the button
                toggleDebugMode();
              }}
              className="text-blue-700 hover:text-blue-900 focus:outline-none"
              title="Close and disable debug mode"
              aria-label="Close debug panel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </button>
      <div className="context-content">
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
    </dialog>
  );
};
