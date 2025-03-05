import { createContext } from 'react';

interface ShellContextType {
  onAssistantClick: () => void;
  isAssistantOpen: boolean;
}

export const ShellContext = createContext<ShellContextType>({
  onAssistantClick: () => {},
  isAssistantOpen: false
});
