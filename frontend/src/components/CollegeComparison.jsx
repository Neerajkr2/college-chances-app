import React from 'react';

const CollegeComparison = ({ collegeResults, isBlurred }) => {
  return (
    <div className={`form-group ${isBlurred ? 'blurred' : ''}`} id="college-comparison-section">
      <h3>College Comparison</h3>
      <table className="comparison-table">
        <thead>
          <tr>
            <th>College</th>
            <th>Admit Rate</th>
            <th>GPA Avg</th>
            <th>SAT Range</th>
            <th>Your Chance</th>
          </tr>
        </thead>
        <tbody id="college-comparison-body">
          {collegeResults.map((college, index) => (
            <tr key={index}>
              <td>{college.name}</td>
              <td>{college.admitRate}</td>
              <td>{college.gpaAvg}</td>
              <td>{college.combined}</td>
              <td><span className={`chance-badge ${college.badgeClass}`}>{college.chanceLevel}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollegeComparison;