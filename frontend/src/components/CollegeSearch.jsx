import React, { useState, useRef, useEffect } from 'react';
import { collegeData } from '../data/collegeData';

const CollegeSearch = ({ selectedColleges, setSelectedColleges }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setShowResults(false);
      return;
    }

    const filteredColleges = collegeData.filter(college =>
      college.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);

    setSearchResults(filteredColleges);
    setShowResults(filteredColleges.length > 0);
  };

  const addCollege = (college) => {
    if (selectedColleges.size >= 5) {
      alert('You can only select up to 5 colleges');
      return;
    }

    if (!selectedColleges.has(college.name)) {
      setSelectedColleges(prev => new Set([...prev, college.name]));
    }
    
    setSearchQuery('');
    setShowResults(false);
  };

  const removeCollege = (collegeName) => {
    setSelectedColleges(prev => {
      const newSet = new Set(prev);
      newSet.delete(collegeName);
      return newSet;
    });
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="form-group">
      <label htmlFor="college-search">Search for Colleges</label>
      <div className="college-search-container" ref={searchContainerRef}>
        <input
          type="text"
          id="college-search"
          placeholder="Start typing a college name..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className={`college-search-results ${showResults ? 'active' : ''}`} id="college-search-results">
          {searchResults.map((college, index) => (
            <div
              key={index}
              className="college-option"
              onClick={() => addCollege(college)}
            >
              {college.name}
            </div>
          ))}
        </div>
      </div>
      <p className="input-help">Select up to 5 colleges to compare</p>

      <div id="selected-colleges" style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} id="selected-colleges-container">
          {Array.from(selectedColleges).map((collegeName, index) => (
            <div
              key={index}
              className="chip selected"
              onClick={() => removeCollege(collegeName)}
            >
              {collegeName}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollegeSearch;