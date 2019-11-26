import React, { useState, useEffect } from 'react';
import './DebouncedSearchInput.scss';
import useDebounce from '../../customHooks/useDebounce';

export interface DebouncedSearchInputProps {
  onDebouncedTextChange(term: string): void;
}

const DebouncedSearchInput = ({
  onDebouncedTextChange
}: DebouncedSearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    onDebouncedTextChange(debouncedSearchTerm);
  }, [debouncedSearchTerm]);
  return (
    <input
      className="search-input"
      placeholder="Search"
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
    />
  );
};

export default DebouncedSearchInput;
