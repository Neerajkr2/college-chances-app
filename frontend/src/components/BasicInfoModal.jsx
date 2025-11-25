// frontend/src/components/BasicInfoModal.jsx
import React, { useState, useEffect, useRef } from 'react';

const BasicInfoModal = ({ isOpen, onClose, onSubmit, formData, selectedColleges }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setIsSubmitting(false);
      // Focus first input when modal opens
      setTimeout(() => {
        if (firstNameRef.current) {
          firstNameRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email) {
      alert('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send user info and automatically trigger report sending
      const userData = {
        firstName,
        lastName,
        email,
        gpa: formData.gpa.toFixed(1),
        satScore: formData.sat || '0',
        graduationYear: formData.gradYear
      };

      const response = await fetch('/api/store-user-and-send-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData,
          selectedColleges: Array.from(selectedColleges).map(name => 
            ({ name, combined: '', admitRate: '', gpaAvg: '' })
          ),
          formData: userData
        })
      });

      const result = await response.json();

      if (result.success) {
        // Call the onSubmit callback with user info
        onSubmit({ firstName, lastName, email });
      } else {
        alert(result.message || 'Failed to send report. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error sending report:', error);
      alert('Failed to send report. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" id="basic-info-modal" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>Get Your Full Report</h2>
        </div>
        <div className="modal-body">
          <div className="modal-form active" id="basic-info-form">
            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
              Enter your details to receive your personalized college admission report immediately.
            </p>
            
            <div className="name-row">
              <div className="name-field">
                <label htmlFor="first-name">First Name</label>
                <input
                  ref={firstNameRef}
                  type="text"
                  id="first-name"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isSubmitting}
                />
              </div>
              <div className="name-field">
                <label htmlFor="last-name">Last Name</label>
                <input
                  ref={lastNameRef}
                  type="text"
                  id="last-name"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="basic-info-email">Email</label>
              <input
                ref={emailRef}
                type="email"
                id="basic-info-email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSubmitting}
              />
            </div>
            <button 
              className="btn btn-primary btn-full" 
              id="basic-info-submit" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending Your Report...' : 'Get My Full Report'}
            </button>
            
            {isSubmitting && (
              <p style={{ textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '14px' }}>
                Your report is being generated and will be sent to your email...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoModal;