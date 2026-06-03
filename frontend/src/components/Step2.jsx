// frontend/src/components/Step2.jsx
import React from 'react';
import ChanceGauge from './ChanceGauge';
import CollegeComparison from './CollegeComparison';
import ReportTeaser from './ReportTeaser';

const Step2 = ({ 
  formData, 
  selectedColleges, 
  collegeData, 
  calculationResults, 
  onBack, 
  onRestart,
  isLoggedIn,
  userEmail,
  userInfo 
}) => {
  // Show full report only after user submits basic info
  const showFullReport = isLoggedIn;

  return (
    <div className="step active" id="step2">
      {/* Enhanced Results Header */}
      <div className="results-header">
        <h2>Your College Chances</h2>
        <p className="results-subtitle">Based on your academic profile and selected colleges</p>
        <div className="results-highlight">
          <span>GPA: <strong id="results-gpa">{formData.gpa.toFixed(1)}</strong></span>
          <span>•</span>
          <span>SAT: <strong id="results-sat">{formData.sat || '-'}</strong></span>
          {showFullReport && (
            <>
              <span>•</span>
              <span>Student: <strong>{userInfo.firstName} {userInfo.lastName}</strong></span>
            </>
          )}
        </div>
      </div>

      {/* Results Row with Modern Gauge and Explanation */}
      <div className="results-row">
        <ChanceGauge 
          overallChance={calculationResults.overallChance}
          percentage={calculationResults.percentage}
          isBlurred={!isLoggedIn}
        />

        <div className="chance-explanation" id="chance-explanation-section">
          <h4>Understanding Your Chances</h4>
          <div className="chance-explanation-item">
            <strong>Target:</strong> Your SAT score falls within the college's range and your GPA is
            close to their average.
          </div>
          <div className="chance-explanation-item">
            <strong>Likely:</strong> Your SAT score exceeds the college's range and your GPA is
            higher than their average.
          </div>
          <div className="chance-explanation-item">
            <strong>Reach:</strong> Your scores are below the college's typical SAT or GPA ranges.
          </div>
        </div>
      </div>

      {/* College Comparison Table with blur effect */}
      <CollegeComparison 
        collegeResults={calculationResults.collegeResults}
        isBlurred={!isLoggedIn}
      />

      {/* Enhanced Summary Section */}
      <div className="summary-section">
        <h3>Summary</h3>
        <p id="summary-text">{calculationResults.summaryText}</p>
      </div>

      {/* CONDITIONAL CONTENT: Show Email Gate BEFORE submission, Full Report AFTER submission */}
      {!showFullReport ? (
        /* ORIGINAL EMAIL GATE CONTENT (Before basic info submission) */
        <div className="email-gate">
          <ReportTeaser />

          <h3>Unlock Your Full Report</h3>
          <p>Enter your email to receive a detailed report with personalized recommendations and a score
            improvement plan.</p>

          {/* Note: The BasicInfoModal will handle the actual form submission */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ color: '#666', fontSize: '14px' }}>
              <strong>Basic information required to generate your full report</strong>
            </p>
            <p style={{ color: '#666', fontSize: '12px' }}>
              The modal will appear automatically to collect your information
            </p>
          </div>
        </div>
      ) : (
        /* FULL REPORT CONTENT (After basic info submission) */
        <div className="full-report">
          {/* Success Notification */}
          <div className="success-notification" style={{ 
            background: '#f0f9ff', 
            border: '2px solid #0ea5e9',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>✅</div>
            <h3 style={{ color: '#0369a1', marginBottom: '10px' }}>Report Generated Successfully!</h3>
            <p style={{ color: '#475569', margin: 0 }}>
              Your comprehensive college admission report has also been sent to <strong>{userEmail}</strong>.
            </p>
          </div>

          {/* Current Standing Section */}
          <div className="report-section">
            <h3 style={{ fontSize: '22px', color: '#2d3748', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px' }}>🎓</span> Your Current Standing
            </h3>
            
            <div className="metrics-grid" style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
              <div className="metric-card" style={{
                flex: '1',
                minWidth: '200px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '25px 15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>📊</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4361ee', marginBottom: '8px' }}>{formData.gpa.toFixed(1)}</div>
                <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>GPA Score</div>
              </div>
              
              <div className="metric-card" style={{
                flex: '1',
                minWidth: '200px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '25px 15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>🎯</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4361ee', marginBottom: '8px' }}>{formData.sat || '0'}</div>
                <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>SAT Score</div>
              </div>
              
              <div className="metric-card" style={{
                flex: '1',
                minWidth: '200px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '25px 15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>🏆</div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{
                    background: calculationResults.overallChance === 'Reach' ? 'linear-gradient(135deg, #f56565, #e53e3e)' :
                              calculationResults.overallChance === 'Target' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                              'linear-gradient(135deg, #48bb78, #38a169)',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {calculationResults.overallChance}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Overall Classification</div>
              </div>
            </div>
          </div>

          {/* REPLACED: Admission Outlook Summary with Personalized Improvement Roadmap */}
          <div className="improvement-roadmap-section" style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <h3 style={{ fontSize: '22px', color: '#2d3748', marginBottom: '25px', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px' }}>🎯</span> Your Personalized Improvement Roadmap
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* SAT Score Improvement */}
              <div style={{
                background: '#ffffff',
                borderLeft: '4px solid #4361ee',
                borderRadius: '8px',
                padding: '25px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <table width="100%" border="0" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td width="50" style={{ verticalAlign: 'top' }}>
                      <div style={{ fontSize: '24px', color: '#4361ee' }}>📈</div>
                    </td>
                    <td style={{ verticalAlign: 'top' }}>
                      <h4 style={{ color: '#2d3748', margin: '0 0 12px 0', fontSize: '18px' }}>SAT Score Improvement</h4>
                      <p style={{ color: '#4a5568', margin: '0', fontSize: '14px', lineHeight: '1.6' }}>
                        <strong>Target Increase:</strong> 120-150 points<br/>
                        <strong>Recommended Score:</strong> 1530-1580<br/>
                        <strong>Timeline:</strong> 3-4 months of focused preparation
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              {/* Academic Strategy */}
              <div style={{
                background: '#ffffff',
                borderLeft: '4px solid #4361ee',
                borderRadius: '8px',
                padding: '25px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <table width="100%" border="0" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td width="50" style={{ verticalAlign: 'top' }}>
                      <div style={{ fontSize: '24px', color: '#4361ee' }}>⭐</div>
                    </td>
                    <td style={{ verticalAlign: 'top' }}>
                      <h4 style={{ color: '#2d3748', margin: '0 0 12px 0', fontSize: '18px' }}>Academic Strategy</h4>
                      <p style={{ color: '#4a5568', margin: '0', fontSize: '14px', lineHeight: '1.6' }}>
                        Focus on maintaining strong GPA while preparing for SAT retake. Consider advanced coursework to demonstrate academic rigor.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              {/* Application Enhancement */}
              <div style={{
                background: '#ffffff',
                borderLeft: '4px solid #4361ee',
                borderRadius: '8px',
                padding: '25px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <table width="100%" border="0" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td width="50" style={{ verticalAlign: 'top' }}>
                      <div style={{ fontSize: '24px', color: '#4361ee' }}>📝</div>
                    </td>
                    <td style={{ verticalAlign: 'top' }}>
                      <h4 style={{ color: '#2d3748', margin: '0 0 12px 0', fontSize: '18px' }}>Application Enhancement</h4>
                      <p style={{ color: '#4a5568', margin: '0', fontSize: '14px', lineHeight: '1.6' }}>
                        Develop compelling personal statements and secure strong letters of recommendation to strengthen your overall application.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              {/* Next 30 Days Action Items */}
              <div style={{
                background: '#ffffff',
                borderLeft: '4px solid #4361ee',
                borderRadius: '8px',
                padding: '25px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <table width="100%" border="0" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td width="50" style={{ verticalAlign: 'top' }}>
                      <div style={{ fontSize: '24px', color: '#4361ee' }}>🎯</div>
                    </td>
                    <td style={{ verticalAlign: 'top' }}>
                      <h4 style={{ color: '#2d3748', margin: '0 0 12px 0', fontSize: '18px' }}>Next 30 Days Action Items</h4>
                      <p style={{ color: '#4a5568', margin: '0', fontSize: '14px', lineHeight: '1.6' }}>
                        • Enroll in our Free 4 Week SAT Bootcamp<br/>
                        • Focus on Math section for maximum score impact<br/>
                        • Meet your counselor to discuss GPA strategies<br/>
                        • Create a 6-8 hour weekly study plan
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          {/* Exclusive Offer */}
          <div className="exclusive-offer" style={{
            background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
            color: '#ffffff',
            borderRadius: '12px',
            padding: '40px 30px',
            marginTop: '30px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 15px 0' }}>🎁 Exclusive Offer</h2>
            <p style={{ fontSize: '20px', margin: '0 0 30px 0', opacity: '0.95' }}>Free 4 Week SAT Bootcamp</p>
            <p style={{ fontSize: '16px', margin: '0 0 40px 0', opacity: '0.9', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
              Transform your scores with our proven methods and expert guidance
            </p>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
              <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
                <div style={{ fontSize: '32px', marginBottom: '15px' }}>🎯</div>
                <h4 style={{ fontSize: '16px', margin: '0 0 8px 0' }}>Live Interactive Classes</h4>
              </div>
              <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
                <div style={{ fontSize: '32px', marginBottom: '15px' }}>📊</div>
                <h4 style={{ fontSize: '16px', margin: '0 0 8px 0' }}>Personalized Study Plans</h4>
              </div>
              <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
                <div style={{ fontSize: '32px', marginBottom: '15px' }}>🧪</div>
                <h4 style={{ fontSize: '16px', margin: '0 0 8px 0' }}>Practice Tests & Analytics</h4>
              </div>
            </div>
            
            {/* Bootcamp Button with Link */}
            <a 
              href="https://www.prepitus.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn" 
              style={{ 
                background: '#ffffff', 
                color: '#4361ee', 
                padding: '16px 40px', 
                border: 'none',
                borderRadius: '50px', 
                textDecoration: 'none', 
                fontWeight: 'bold', 
                fontSize: '16px',
                cursor: 'pointer',
                marginTop: '20px',
                display: 'inline-block'
              }}
            >
              Start Your FREE Bootcamp Now
            </a>
          </div>
        </div>
      )}

      <div className="navigation">
        <button className="btn btn-outline" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={onRestart}>Start Over</button>
      </div>
    </div>
  );
};

export default Step2;