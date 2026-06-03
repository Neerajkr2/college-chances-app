export const calculateChances = (gpa, sat, selectedColleges, collegeData) => {
  let reachCount = 0;
  let targetCount = 0;
  let likelyCount = 0;

  const collegesToShow = selectedColleges.size > 0 ?
    Array.from(selectedColleges).map(name => collegeData.find(c => c.name === name)) :
    collegeData.slice(0, 5);

  const collegeResults = collegesToShow.map(college => {
    if (!college) return null;

    const satRange = college.combined.split(' - ').map(Number);
    const satMin = satRange[0];
    const satMax = satRange[1];

    let chanceLevel, badgeClass;

    if (sat >= satMin && sat <= satMax && gpa >= parseFloat(college.gpaAvg) - 0.2) {
      chanceLevel = 'Target';
      badgeClass = 'chance-target';
      targetCount++;
    } else if (sat > satMax && gpa > parseFloat(college.gpaAvg)) {
      chanceLevel = 'Likely';
      badgeClass = 'chance-likely';
      likelyCount++;
    } else {
      chanceLevel = 'Reach';
      badgeClass = 'chance-reach';
      reachCount++;
    }

    return {
      ...college,
      chanceLevel,
      badgeClass
    };
  }).filter(Boolean);

  // Update gauge based on results
  const totalColleges = collegesToShow.length;
  let overallChance = 'Reach';
  let percentage = 25;

  if (likelyCount > targetCount && likelyCount > reachCount) {
    overallChance = 'Likely';
    percentage = 75;
  } else if (targetCount > reachCount) {
    overallChance = 'Target';
    percentage = 50;
  }

  // Update summary text
  let summaryText = '';
  if (sat < 1200 || gpa < 3.0) {
    summaryText = `Your GPA of ${gpa.toFixed(1)} and SAT score of ${sat} place you below the typical admitted range for most colleges. Focus on improving both your GPA and SAT score to increase your admission chances.`;
  } else if (sat < 1400 || gpa < 3.5) {
    summaryText = `Your GPA of ${gpa.toFixed(1)} and SAT score of ${sat} are competitive for many colleges. Improving your SAT score by 50-100 points could significantly increase your admission chances at more selective institutions.`;
  } else {
    summaryText = `Your GPA of ${gpa.toFixed(1)} and SAT score of ${sat} are strong and competitive for many selective colleges. You're well-positioned for admission to a wide range of institutions.`;
  }

  return {
    collegeResults,
    overallChance,
    percentage,
    summaryText,
    counts: {
      reach: reachCount,
      target: targetCount,
      likely: likelyCount,
      total: totalColleges
    }
  };
};

export const generateReport = async (userData, selectedColleges, collegeData) => {
  const email = userData.email;
  if (!email) {
    alert('Please enter your email address to receive the full report.');
    return { success: false };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return { success: false };
  }

  // Get selected college data
  const selectedCollegeData = Array.from(selectedColleges).map(name =>
    collegeData.find(c => c.name === name)
  ).filter(Boolean);

  // If no colleges selected, use default ones
  const collegesToSend = selectedCollegeData.length > 0 ?
    selectedCollegeData : collegeData.slice(0, 3);

  try {
    console.log('📧 Sending report request to backend...');

    // Send data to backend
    const response = await fetch('/api/send-college-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userData: userData,
        selectedColleges: collegesToSend
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Error sending report:', error);
    return { 
      success: false, 
      message: 'Failed to send report. Please check your connection and try again.' 
    };
  }
};