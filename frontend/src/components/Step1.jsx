import React, { useState } from 'react';
import CollegeSearch from './CollegeSearch';

const Step1 = ({ 
  formData, 
  setFormData, 
  selectedColleges, 
  setSelectedColleges, 
  onNext 
}) => {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [extracurriculars, setExtracurriculars] = useState({
    role: '',
    recognition: '',
    hours: 0,
    years: ''
  });

  const activityChips = [
    'STEM/Research',
    'Athletics',
    'Arts',
    'Service/Leadership',
    'Work/Family',
    'Entrepreneurship'
  ];

  const handleGpaChange = (value) => {
    setFormData(prev => ({
      ...prev,
      gpa: value / 10
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExtracurricularChange = (field, value) => {
    setExtracurriculars(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
  };

  const handleSeeChances = () => {
    onNext();
  };

  return (
    <div className="step active" id="step1">
      <h2>Student Profile & Activities</h2>
      <p className="input-help">Tell us about the student's academic profile and activities</p>

      <div className="form-group">
        <label htmlFor="gpa">GPA (Unweighted, 0.0-4.0 scale)</label>
        <div className="slider-container">
          <input 
            type="range" 
            id="gpa" 
            min="0" 
            max="40" 
            value={formData.gpa * 10} 
            step="1"
            onChange={(e) => handleGpaChange(parseInt(e.target.value))}
          />
          <div className="slider-value" id="gpa-value">
            {formData.gpa.toFixed(1)}
          </div>
        </div>
        <p className="input-help">We use unweighted GPA for consistent comparisons across schools</p>
      </div>

      <div className="form-group">
        <label htmlFor="sat">SAT Score (400-1600)</label>
        <input 
          type="number" 
          id="sat" 
          min="400" 
          max="1600" 
          placeholder="Enter your SAT score" 
          value={formData.sat}
          onChange={(e) => handleInputChange('sat', e.target.value)}
        />
        <p className="input-help">Based on the current SAT format</p>
      </div>

      <div className="form-group">
        <label htmlFor="grad-year">Graduation Year</label>
        <select 
          id="grad-year"
          value={formData.gradYear}
          onChange={(e) => handleInputChange('gradYear', e.target.value)}
        >
          <option value="" selected disabled>Select Graduation Year</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
          <option value="2028">2028</option>
        </select>
      </div>

      <CollegeSearch 
        selectedColleges={selectedColleges}
        setSelectedColleges={setSelectedColleges}
      />

      <div className="ec-section">
        <h3>Extracurricular Profile (Optional)</h3>
        <p className="input-help">Adding extracurriculars helps us provide a more accurate estimate</p>

        <div className="form-group">
          <label>Student's Top Activity</label>
          <div className="chips-container">
            {activityChips.map((activity, index) => (
              <div
                key={index}
                className={`chip ${selectedActivity === activity ? 'selected' : ''}`}
                onClick={() => handleActivitySelect(activity)}
              >
                {activity}
              </div>
            ))}
          </div>
        </div>

        <div className="ec-row">
          <div className="ec-field">
            <label htmlFor="role">Role</label>
            <select 
              id="role"
              value={extracurriculars.role}
              onChange={(e) => handleExtracurricularChange('role', e.target.value)}
            >
              <option value="" selected disabled>Select Role</option>
              <option value="member">Member</option>
              <option value="contributor">Contributor</option>
              <option value="leader">Leader</option>
              <option value="founder">Founder</option>
            </select>
          </div>

          <div className="ec-field">
            <label htmlFor="recognition">Recognition Level</label>
            <select 
              id="recognition"
              value={extracurriculars.recognition}
              onChange={(e) => handleExtracurricularChange('recognition', e.target.value)}
            >
              <option value="" selected disabled>Select Recognition</option>
              <option value="none">None</option>
              <option value="school">School</option>
              <option value="regional">Regional</option>
              <option value="state">State</option>
              <option value="national">National/International</option>
            </select>
          </div>
        </div>

        <div className="ec-row">
          <div className="ec-field">
            <label htmlFor="hours">Hours per Week</label>
            <div className="slider-container">
              <input 
                type="range" 
                id="hours" 
                min="0" 
                max="20" 
                value={extracurriculars.hours}
                onChange={(e) => handleExtracurricularChange('hours', parseInt(e.target.value))}
              />
              <div className="slider-value" id="hours-value">
                {extracurriculars.hours}
              </div>
            </div>
          </div>

          <div className="ec-field">
            <label htmlFor="years">Years Active</label>
            <select 
              id="years"
              value={extracurriculars.years}
              onChange={(e) => handleExtracurricularChange('years', e.target.value)}
            >
              <option value="" selected disabled>Select Years</option>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="4">4+ years</option>
            </select>
          </div>
        </div>
      </div>

      <div className="navigation">
        <div></div>
        <button className="btn btn-primary" id="see-chances-btn" onClick={handleSeeChances}>
          See My Chances
        </button>
      </div>
    </div>
  );
};

export default Step1;