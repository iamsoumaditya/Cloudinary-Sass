"use client"
import { useSearch } from '@/context/searchContext';
import { useEffect, useState } from 'react';

export default function SearchInput() {
  const { query, setQuery } = useSearch();
  const [inputValue, setInputValue] = useState<string>(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(inputValue);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, setQuery]);

  return (
    <input
      type="text"
      placeholder="Search images & videos ..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className="input input-bordered hidden sm:block min-w-24 md:w-auto focus:outline-0"
    />
  );
}
