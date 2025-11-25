// frontend/src/components/Wizard.jsx
import React, { useState, useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import BasicInfoModal from './BasicInfoModal';
import { collegeData } from '../data/collegeData';
import { calculateChances } from '../utils/calculations';

const Wizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    gpa: 0.0,
    sat: '',
    gradYear: ''
  });
  const [selectedColleges, setSelectedColleges] = useState(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
  const [calculationResults, setCalculationResults] = useState({
    collegeResults: [],
    overallChance: 'Reach',
    percentage: 25,
    summaryText: 'Enter your GPA and SAT score to see your personalized admission chances summary.',
    counts: {
      reach: 0,
      target: 0,
      likely: 0,
      total: 0
    }
  });

  // Auto-scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const nextStep = () => {
    // Calculate chances before proceeding
    const results = calculateChances(
      formData.gpa,
      parseInt(formData.sat) || 0,
      selectedColleges,
      collegeData
    );
    
    setCalculationResults(results);
    
    // Move to next step
    setCurrentStep(2);

    // Show basic info modal if not logged in (after 3 seconds delay as in original)
    if (!isLoggedIn) {
      setTimeout(() => {
        setShowBasicInfoModal(true);
      }, 3000);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const restartWizard = () => {
    setCurrentStep(1);
    setFormData({
      gpa: 0.0,
      sat: '',
      gradYear: ''
    });
    setSelectedColleges(new Set());
    setCalculationResults({
      collegeResults: [],
      overallChance: 'Reach',
      percentage: 25,
      summaryText: 'Enter your GPA and SAT score to see your personalized admission chances summary.',
      counts: {
        reach: 0,
        target: 0,
        likely: 0,
        total: 0
      }
    });
  };

  const handleBasicInfoSubmit = (info) => {
    setUserInfo(info);
    setUserEmail(info.email);
    setIsLoggedIn(true);
    setShowBasicInfoModal(false);
    // Blur is automatically removed because isLoggedIn becomes true
  };

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h1>College Chances Calculator</h1>
        <p>Find out your admission chances in 2 simple steps</p>
      </div>

      <div className="progress-bar">
        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`} id="step1-progress"></div>
        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`} id="step2-progress"></div>
      </div>

      <div className="wizard-body">
        {currentStep === 1 && (
          <Step1
            formData={formData}
            setFormData={setFormData}
            selectedColleges={selectedColleges}
            setSelectedColleges={setSelectedColleges}
            onNext={nextStep}
          />
        )}

        {currentStep === 2 && (
          <Step2
            formData={formData}
            selectedColleges={selectedColleges}
            collegeData={collegeData}
            calculationResults={calculationResults}
            onBack={prevStep}
            onRestart={restartWizard}
            isLoggedIn={isLoggedIn}
            userEmail={userEmail}
            userInfo={userInfo}
          />
        )}
      </div>

      <BasicInfoModal
        isOpen={showBasicInfoModal}
        onClose={() => setShowBasicInfoModal(false)}
        onSubmit={handleBasicInfoSubmit}
        formData={formData}
        selectedColleges={selectedColleges}
      />
    </div>
  );
};

export default Wizard;