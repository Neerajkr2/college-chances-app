import React from 'react';

const ReportSuccessModal = ({ isOpen, email, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" id="report-success-modal">
      <div className="modal">
        <div className="modal-header">
          <h2>Report Sent Successfully!</h2>
        </div>
        <div className="modal-body report-success-modal">
          <div className="report-success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h3>Your Full Report is on its Way!</h3>
          <p>We've sent your comprehensive college admission report to <strong id="sent-email">{email}</strong>.</p>
          <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '20px' }}>Continue</button>
        </div>
      </div>
    </div>
  );
};

export default ReportSuccessModal;