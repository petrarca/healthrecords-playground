import { useState, useCallback, useRef, useEffect } from "react"
import { Input } from "./ui/input"
import { searchService } from "../services/searchService"
import { SearchResult } from "../types/search"

interface SearchProps {
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
}

export function Search({ onResultSelect, className = '' }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      setIsSearching(false);
      setResults([]);
      setSelectedIndex(-1);
    }
  }, []);

  const executeSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await searchService.search(searchTerm);
      setResults(searchResults);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm]);

  const selectResult = useCallback((result: SearchResult) => {
    onResultSelect?.(result);
    setIsSearching(false);
    setSearchTerm('');
    setResults([]);
  }, [onResultSelect]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && results.length > 0) {
          selectResult(results[selectedIndex]);
        } else {
          executeSearch();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (results.length > 0) {
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (results.length > 0) {
          setSelectedIndex(prev => Math.max(prev - 1, -1));
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsSearching(false);
        setResults([]);
        break;
    }
  }, [results, selectedIndex, selectResult, executeSearch]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSearching(false);
        setResults([]);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Input
          type="search"
          value={searchTerm}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          className="pl-10"
          placeholder="Search patients... (press Enter)"
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {(results.length > 0) && (
        <div className="absolute mt-2 w-full rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 overflow-auto max-h-96">
          {results.map((result, index) => (
            <div
              key={result.id}
              ref={index === selectedIndex ? selectedItemRef : null}
              onClick={() => selectResult(result)}
              className={`
                px-4 py-2 cursor-pointer flex items-start gap-3
                ${index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'}
              `}
            >
              <svg className="w-5 h-5 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <div className="text-sm font-medium text-gray-900">{result.title}</div>
                {result.subtitle && (
                  <div className="text-sm text-gray-500">{result.subtitle}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
