/** @jsxImportSource react */
import React, { useState, useCallback, useRef, useEffect } from "react"
import { SearchResult, SearchResultType } from "../types/search"
import { searchService, SearchOptions } from "../services/searchService"
import { Dropdown } from "./ui/dropdown"

const searchTypeOptions = [
  { 
    value: 'ALL' as const, 
    label: 'All',
    icon: '🔍'
  },
  { 
    value: SearchResultType.PATIENT, 
    label: 'Patients',
    icon: '👤'
  }
];

const MIN_SEARCH_LENGTH = 3;

interface SearchProps {
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
}

export function Search({ onResultSelect, className = '' }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchOptions['type']>('ALL');
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

  const executeSearch = useCallback(async (value: string) => {
    const trimmedValue = value.trim();
    // Allow * to bypass the minimum length check
    if (trimmedValue === '*' || trimmedValue.length >= MIN_SEARCH_LENGTH) {
      setIsSearching(true);
      try {
        const searchResults = await searchService.search(value, { type: searchType });
        setResults(searchResults);
        // Auto-select first result if available
        setSelectedIndex(searchResults.length > 0 ? 0 : -1);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
        setSelectedIndex(-1);
      }
    } else {
      setIsSearching(false);
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [searchType]);

  const handleTypeChange = useCallback((value: string) => {
    setSearchType(value as SearchOptions['type']);
    setResults([]);
    setIsSearching(false);
    setSelectedIndex(-1);
  }, []);

  const selectResult = useCallback((result: SearchResult) => {
    onResultSelect?.(result);
    setIsSearching(false);
    setSearchTerm('');
    setResults([]);
    setSelectedIndex(-1);
  }, [onResultSelect]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearching && event.key === 'Enter') {
      executeSearch(searchTerm);
      return;
    }

    if (isSearching && results.length > 0) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => {
            const next = prev + 1;
            return next >= results.length ? 0 : next;
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => {
            const next = prev - 1;
            return next < 0 ? results.length - 1 : next;
          });
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0) {
            selectResult(results[selectedIndex]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setIsSearching(false);
          setSelectedIndex(-1);
          break;
      }
    }
  }, [isSearching, results, selectedIndex, searchTerm, executeSearch, selectResult]);

  // Ensure selected item is visible
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSearching(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <Dropdown
          value={searchType}
          onChange={handleTypeChange}
          options={searchTypeOptions}
        />
        <input
          type="search"
          placeholder={`Search patients... (minimum ${MIN_SEARCH_LENGTH} characters)`}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white"
          value={searchTerm}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
        />
      </div>
      
      {isSearching && (
        <div 
          ref={dropdownRef}
          className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {results.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto">
              {results.reduce((acc: JSX.Element[], result, index) => {
                const provider = searchService.getProviderByType(result.type);
                
                // Add header if this is the first result of its type
                if (!results.slice(0, index).find(r => r.type === result.type)) {
                  acc.push(
                    <div key={`header-${result.type}`} className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                      <span className="text-lg">{provider?.getIcon()}</span>
                      <span className="font-medium text-sm text-gray-700">
                        {provider?.getDisplayName()}
                      </span>
                    </div>
                  );
                }
                
                // Add the result item
                acc.push(
                  <div 
                    key={result.id}
                    ref={index === selectedIndex ? selectedItemRef : null}
                    className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                      index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => selectResult(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-center">
                      <div>
                        <div className="font-medium text-gray-900">
                          {result.title}
                        </div>
                        {result.subtitle && (
                          <div className="text-sm text-gray-500">
                            {result.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
                
                return acc;
              }, [])}
            </div>
          ) : searchTerm.length >= MIN_SEARCH_LENGTH ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No results found
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              Please enter at least {MIN_SEARCH_LENGTH} characters to search
            </div>
          )}
        </div>
      )}
    </div>
  );
}
