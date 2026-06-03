// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { storeUser } = require('./userStorage');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Email transporter configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

// Verify transporter on startup
transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ SMTP connection error:', error);
    } else {
        console.log('✅ SMTP server is ready to take messages');
    }
});

// Read the static PDF file
const pdfFilePath = path.join(__dirname, 'Prepitus_College_Admission_Report.pdf');

// Email-compatible HTML Template with Inline Styles
function generateEmailHTML(userData, collegeAnalysis) {
    const firstName = userData.firstName || 'Student';
    const gpa = userData.gpa;
    const satScore = userData.satScore;
    
    const totalColleges = collegeAnalysis.colleges.length;
    const likelyCount = collegeAnalysis.summary.likely;
    const targetCount = collegeAnalysis.summary.target;
    const reachCount = collegeAnalysis.summary.reach;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your College Admission Report - Prepitus</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
    <!-- Main Container -->
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <!-- Email Container -->
                <table width="100%" max-width="600" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%); padding: 40px 30px; text-align: center; color: #ffffff;">
                            <h1 style="font-size: 32px; font-weight: bold; margin: 0 0 10px 0;">Prepitus</h1>
                            <p style="font-size: 20px; margin: 0 0 8px 0; font-weight: 600;">Your College Admission Report</p>
                            <p style="font-size: 16px; margin: 0; opacity: 0.9;">Personalized Analysis & Strategic Action Plan</p>
                        </td>
                    </tr>
                    
                    <!-- Welcome Section -->
                    <tr>
                        <td style="padding: 40px 30px; text-align: center; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                            <h2 style="font-size: 24px; color: #2d3748; margin: 0 0 15px 0;">Hello, ${firstName}! 👋</h2>
                            <p style="font-size: 16px; color: #4a5568; line-height: 1.6; margin: 0; max-width: 500px; margin-left: auto; margin-right: auto;">
                                Thank you for using the Prepitus College Chances Calculator! Based on your academic profile, we've prepared this detailed report to help you understand your admission chances and create a clear roadmap to your dream colleges.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Current Standing -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <h3 style="font-size: 22px; color: #2d3748; margin: 0; display: flex; align-items: center;">
                                            <span style="margin-right: 10px;">🎓</span> Your Current Standing
                                        </h3>
                                    </td>
                                </tr>
                                
                                <!-- Metrics Grid -->
                                <tr>
                                    <td>
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                                            <tr>
                                                <td width="33%" align="center" style="padding: 0 10px;">
                                                    <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px 15px; text-align: center;">
                                                        <div style="font-size: 24px; margin-bottom: 10px;">📊</div>
                                                        <div style="font-size: 32px; font-weight: bold; color: #4361ee; margin-bottom: 8px;">${gpa}</div>
                                                        <div style="font-size: 12px; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">GPA Score</div>
                                                    </div>
                                                </td>
                                                <td width="33%" align="center" style="padding: 0 10px;">
                                                    <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px 15px; text-align: center;">
                                                        <div style="font-size: 24px; margin-bottom: 10px;">🎯</div>
                                                        <div style="font-size: 32px; font-weight: bold; color: #4361ee; margin-bottom: 8px;">${satScore}</div>
                                                        <div style="font-size: 12px; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">SAT Score</div>
                                                    </div>
                                                </td>
                                                <td width="33%" align="center" style="padding: 0 10px;">
                                                    <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px 15px; text-align: center;">
                                                        <div style="font-size: 24px; margin-bottom: 10px;">🏆</div>
                                                        <div style="margin-bottom: 8px;">
                                                            <span style="background: linear-gradient(135deg, #f56565, #e53e3e); color: #ffffff; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                                                                ${collegeAnalysis.overallChance}
                                                            </span>
                                                        </div>
                                                        <div style="font-size: 12px; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Classification</div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Info Box -->
                                <tr>
                                    <td>
                                        <div style="background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%); border: 2px solid #90cdf4; border-radius: 12px; padding: 25px; margin: 20px 0;">
                                            <h4 style="color: #2b6cb0; font-size: 18px; margin: 0 0 15px 0; display: flex; align-items: center;">
                                                <span style="margin-right: 8px;">💡</span> Understanding Your Classification
                                            </h4>
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="padding: 10px 0;">
                                                        <span style="background: #fef3c7; color: #92400e; padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: bold; margin-right: 10px;">Target</span>
                                                        <span style="color: #4a5568; font-size: 14px;">Your SAT score falls within the college's average range</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0;">
                                                        <span style="background: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: bold; margin-right: 10px;">Likely</span>
                                                        <span style="color: #4a5568; font-size: 14px;">Your SAT score and GPA are higher than the college's average</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0;">
                                                        <span style="background: #fee2e2; color: #991b1b; padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: bold; margin-right: 10px;">Reach</span>
                                                        <span style="color: #4a5568; font-size: 14px;">Your scores are below the college's typical SAT or GPA range</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- College Analysis -->
                    <tr>
                        <td style="padding: 40px 30px; background-color: #f8fafc;">
                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <h3 style="font-size: 22px; color: #2d3748; margin: 0; display: flex; align-items: center;">
                                            <span style="margin-right: 10px;">🏫</span> Selected Colleges Analysis
                                        </h3>
                                    </td>
                                </tr>
                                
                                <!-- College Table -->
                                <tr>
                                    <td>
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                            <tr style="background: linear-gradient(135deg, #4361ee, #3a0ca3);">
                                                <th style="padding: 15px; text-align: left; color: #ffffff; font-size: 14px; font-weight: bold;">College</th>
                                                <th style="padding: 15px; text-align: left; color: #ffffff; font-size: 14px; font-weight: bold;">Your Chance</th>
                                                <th style="padding: 15px; text-align: left; color: #ffffff; font-size: 14px; font-weight: bold;">Admit Rate</th>
                                                <th style="padding: 15px; text-align: left; color: #ffffff; font-size: 14px; font-weight: bold;">Gap Analysis</th>
                                            </tr>
                                            ${collegeAnalysis.colleges.map(college => `
                                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                                <td style="padding: 15px; font-size: 14px; color: #2d3748; font-weight: bold;">${college.name}</td>
                                                <td style="padding: 15px;">
                                                    <span style="
                                                        ${college.chance === 'Likely' ? 'background: #dcfce7; color: #166534;' : ''}
                                                        ${college.chance === 'Target' ? 'background: #fef3c7; color: #92400e;' : ''}
                                                        ${college.chance === 'Reach' ? 'background: #fee2e2; color: #991b1b;' : ''}
                                                        padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: bold;
                                                    ">${college.chance}</span>
                                                </td>
                                                <td style="padding: 15px; font-size: 14px; color: #4a5568;">${college.admitRate}</td>
                                                <td style="padding: 15px; font-size: 14px; color: #4a5568;">${college.gapAnalysis}</td>
                                            </tr>
                                            `).join('')}
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Summary Stats -->
                                <tr>
                                    <td>
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                                            <tr>
                                                <td width="33%" align="center">
                                                    <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center;">
                                                        <div style="font-size: 36px; font-weight: bold; color: #16a34a; margin-bottom: 5px;">${likelyCount}</div>
                                                        <div style="font-size: 12px; color: #718096; font-weight: 600; text-transform: uppercase;">Likely Admissions</div>
                                                    </div>
                                                </td>
                                                <td width="33%" align="center">
                                                    <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center;">
                                                        <div style="font-size: 36px; font-weight: bold; color: #d97706; margin-bottom: 5px;">${targetCount}</div>
                                                        <div style="font-size: 12px; color: #718096; font-weight: 600; text-transform: uppercase;">Target Range</div>
                                                    </div>
                                                </td>
                                                <td width="33%" align="center">
                                                    <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center;">
                                                        <div style="font-size: 36px; font-weight: bold; color: #dc2626; margin-bottom: 5px;">${reachCount}</div>
                                                        <div style="font-size: 12px; color: #718096; font-weight: 600; text-transform: uppercase;">Reach Schools</div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Admission Outlook -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <h3 style="font-size: 22px; color: #2d3748; margin: 0; display: flex; align-items: center;">
                                            <span style="margin-right: 10px;">📈</span> Admission Outlook Summary
                                        </h3>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td>
                                        <div style="background: linear-gradient(135deg, #f8fafc, #f1f5f9); padding: 25px; border-radius: 12px; border-left: 4px solid #4361ee; margin-bottom: 20px;">
                                            <p style="margin: 0 0 12px 0; font-size: 16px; color: #2d3748;"><strong>Total Colleges Analyzed:</strong> ${totalColleges}</p>
                                            <p style="margin: 0 0 12px 0; font-size: 16px; color: #2d3748;"><strong>Likely Admissions:</strong> ${likelyCount}</p>
                                            <p style="margin: 0 0 12px 0; font-size: 16px; color: #2d3748;"><strong>Target Range:</strong> ${targetCount}</p>
                                            <p style="margin: 0 0 0 0; font-size: 16px; color: #2d3748;"><strong>Reach Schools:</strong> ${reachCount}</p>
                                        </div>
                                    </td>
                                </tr>
                                
                                ${reachCount > 0 ? `
                                <tr>
                                    <td>
                                        <div style="background: linear-gradient(135deg, #ebf8ff, #bee3f8); border: 2px solid #90cdf4; border-radius: 12px; padding: 25px;">
                                            <h4 style="color: #2b6cb0; font-size: 18px; margin: 0 0 15px 0; display: flex; align-items: center;">
                                                <span style="margin-right: 8px;">💡</span> From Reach → Target
                                            </h4>
                                            <p style="color: #2d3748; margin: 0; font-size: 16px; line-height: 1.6;">
                                                <strong>Target SAT Increase:</strong> 120-150 points<br>
                                                <strong>Recommended Score:</strong> 1370-1400<br>
                                                <strong>Timeline:</strong> 3-4 months of focused preparation
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                ` : ''}
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Improvement Roadmap -->
                    <tr>
                        <td style="padding: 40px 30px; background-color: #f8fafc;">
                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <h3 style="font-size: 22px; color: #2d3748; margin: 0; display: flex; align-items: center;">
                                            <span style="margin-right: 10px;">🎯</span> Your Personalized Improvement Roadmap
                                        </h3>
                                    </td>
                                </tr>
                                
                                <!-- Roadmap Items -->
                                <tr>
                                    <td>
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding-bottom: 20px;">
                                                    <div style="background: #ffffff; border-left: 4px solid #4361ee; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                                                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                            <tr>
                                                                <td width="50" style="vertical-align: top;">
                                                                    <div style="font-size: 24px; color: #4361ee;">📈</div>
                                                                </td>
                                                                <td style="vertical-align: top;">
                                                                    <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px;">SAT Score Improvement</h4>
                                                                    <p style="color: #4a5568; margin: 0; font-size: 14px; line-height: 1.6;">
                                                                        <strong>Target Increase:</strong> 120-150 points<br>
                                                                        <strong>Recommended Score:</strong> 1370-1400<br>
                                                                        <strong>Timeline:</strong> 3-4 months of focused preparation
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-bottom: 20px;">
                                                    <div style="background: #ffffff; border-left: 4px solid #4361ee; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                                                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                            <tr>
                                                                <td width="50" style="vertical-align: top;">
                                                                    <div style="font-size: 24px; color: #4361ee;">⭐</div>
                                                                </td>
                                                                <td style="vertical-align: top;">
                                                                    <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px;">Academic Strategy</h4>
                                                                    <p style="color: #4a5568; margin: 0; font-size: 14px; line-height: 1.6;">
                                                                        Focus on maintaining strong GPA while preparing for SAT retake. Consider advanced coursework to demonstrate academic rigor.
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-bottom: 20px;">
                                                    <div style="background: #ffffff; border-left: 4px solid #4361ee; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                                                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                            <tr>
                                                                <td width="50" style="vertical-align: top;">
                                                                    <div style="font-size: 24px; color: #4361ee;">📝</div>
                                                                </td>
                                                                <td style="vertical-align: top;">
                                                                    <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px;">Application Enhancement</h4>
                                                                    <p style="color: #4a5568; margin: 0; font-size: 14px; line-height: 1.6;">
                                                                        Develop compelling personal statements and secure strong letters of recommendation to strengthen your overall application.
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div style="background: #ffffff; border-left: 4px solid #4361ee; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                                                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                            <tr>
                                                                <td width="50" style="vertical-align: top;">
                                                                    <div style="font-size: 24px; color: #4361ee;">🎯</div>
                                                                </td>
                                                                <td style="vertical-align: top;">
                                                                    <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px;">Next 30 Days Action Items</h4>
                                                                    <p style="color: #4a5568; margin: 0; font-size: 14px; line-height: 1.6;">
                                                                        • Enroll in our Free 4 Week SAT Bootcamp<br>
                                                                        • Focus on Math section for maximum score impact<br>
                                                                        • Meet your counselor to discuss GPA strategies<br>
                                                                        • Create a 6-8 hour weekly study plan
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Exclusive Offer -->
                    <tr>
                        <td style="padding: 40px 30px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%); color: #ffffff; text-align: center;">
                            <h2 style="font-size: 28px; font-weight: bold; margin: 0 0 15px 0;">🎁 Exclusive Offer</h2>
                            <p style="font-size: 20px; margin: 0 0 30px 0; opacity: 0.95;">Free 4 Week SAT Bootcamp</p>
                            <p style="font-size: 16px; margin: 0 0 40px 0; opacity: 0.9; max-width: 500px; margin-left: auto; margin-right: auto;">
                                Transform your scores with our proven methods and expert guidance
                            </p>
                            
                            <!-- Features -->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td width="25%" align="center" style="padding: 0 10px;">
                                        <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; backdrop-filter: blur(10px);">
                                            <div style="font-size: 32px; margin-bottom: 15px;">🎯</div>
                                            <h4 style="font-size: 16px; margin: 0 0 8px 0;">Live Interactive Classes</h4>
                                            <p style="font-size: 14px; margin: 0; opacity: 0.9;">Expert instructors in real-time sessions</p>
                                        </div>
                                    </td>
                                    <td width="25%" align="center" style="padding: 0 10px;">
                                        <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; backdrop-filter: blur(10px);">
                                            <div style="font-size: 32px; margin-bottom: 15px;">📊</div>
                                            <h4 style="font-size: 16px; margin: 0 0 8px 0;">Personalized Study Plans</h4>
                                            <p style="font-size: 14px; margin: 0; opacity: 0.9;">Based on your gap analysis</p>
                                        </div>
                                    </td>
                                    <td width="25%" align="center" style="padding: 0 10px;">
                                        <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; backdrop-filter: blur(10px);">
                                            <div style="font-size: 32px; margin-bottom: 15px;">🧪</div>
                                            <h4 style="font-size: 16px; margin: 0 0 8px 0;">Practice Tests & Analytics</h4>
                                            <p style="font-size: 14px; margin: 0; opacity: 0.9;">Full-length tests with insights</p>
                                        </div>
                                    </td>
                                    <td width="25%" align="center" style="padding: 0 10px;">
                                        <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; backdrop-filter: blur(10px);">
                                            <div style="font-size: 32px; margin-bottom: 15px;">📝</div>
                                            <h4 style="font-size: 16px; margin: 0 0 8px 0;">Admission Guidance</h4>
                                            <p style="font-size: 14px; margin: 0; opacity: 0.9;">College strategy sessions</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <a href="https://www.prepitus.com/" style="display: inline-block; background: #ffffff; color: #4361ee; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; margin-top: 20px;">
                                Start Your FREE Bootcamp Now
                            </a>
                        </td>
                    </tr>
                    
                    <!-- PDF Notice -->
                    <tr>
                        <td style="padding: 40px 30px; text-align: center;">
                            <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border: 2px solid #0ea5e9; border-radius: 12px; padding: 30px;">
                                <div style="font-size: 48px; margin-bottom: 20px;">📄</div>
                                <h3 style="color: #0369a1; font-size: 22px; margin: 0 0 15px 0;">Your Detailed Report</h3>
                                <p style="color: #475569; font-size: 16px; margin: 0 0 10px 0;">
                                    <strong>A comprehensive PDF report has been attached to this email</strong>
                                </p>
                                <p style="color: #475569; font-size: 15px; margin: 0; line-height: 1.6;">
                                    Your detailed analysis includes college comparisons, improvement strategies, and personalized recommendations to help you achieve your college goals.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #1a202c; color: #a0aec0; padding: 40px 30px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #ffffff; margin-bottom: 15px;">Prepitus</div>
                            <p style="font-size: 16px; margin: 0 0 20px 0;">Empowering students to achieve their college dreams</p>
                            
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="https://www.prepitus.com" style="color: #a0aec0; text-decoration: none; margin: 0 15px; font-size: 14px;">Website</a>
                                        <a href="https://www.prepitus.com/contact" style="color: #a0aec0; text-decoration: none; margin: 0 15px; font-size: 14px;">Contact</a>
                                        <a href="https://www.prepitus.com/privacy" style="color: #a0aec0; text-decoration: none; margin: 0 15px; font-size: 14px;">Privacy Policy</a>
                                        <a href="https://www.prepitus.com/terms" style="color: #a0aec0; text-decoration: none; margin: 0 15px; font-size: 14px;">Terms of Service</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="font-size: 12px; margin: 20px 0 0 0; opacity: 0.8; line-height: 1.6;">
                                You're receiving this email because you used the Prepitus College Chances Calculator.<br>
                                This report is confidential and intended solely for the recipient.<br>
                                © 2024 Prepitus. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}

// College analysis function
function analyzeCollegeChances(userData, selectedColleges) {
    const gpa = parseFloat(userData.gpa);
    const sat = parseInt(userData.satScore);

    const colleges = selectedColleges.map(college => {
        const satRange = college.combined.split(' - ').map(Number);
        const satMin = satRange[0];
        const satMax = satRange[1];
        const avgGpa = parseFloat(college.gpaAvg);

        let chance, gapAnalysis;

        if (sat >= satMin && sat <= satMax && gpa >= avgGpa - 0.2) {
            chance = 'Target';
            gapAnalysis = 'Good fit within range';
        } else if (sat > satMax && gpa > avgGpa) {
            chance = 'Likely';
            gapAnalysis = 'Strong candidate';
        } else {
            chance = 'Reach';
            const gpaGap = Math.max(0, avgGpa - gpa).toFixed(1);
            const satGap = Math.max(0, satMin - sat);
            gapAnalysis = gpaGap > 0 || satGap > 0 ? `-${gpaGap} GPA, -${satGap} SAT` : 'Close match';
        }

        return {
            name: college.name,
            chance: chance,
            admitRate: college.admitRate,
            avgGpa: college.gpaAvg,
            satRange: college.combined,
            gapAnalysis: gapAnalysis
        };
    });

    const summary = {
        likely: colleges.filter(c => c.chance === 'Likely').length,
        target: colleges.filter(c => c.chance === 'Target').length,
        reach: colleges.filter(c => c.chance === 'Reach').length
    };

    let overallChance = 'Reach';
    if (summary.likely > summary.target && summary.likely > summary.reach) {
        overallChance = 'Likely';
    } else if (summary.target >= summary.reach) {
        overallChance = 'Target';
    }

    return {
        colleges,
        summary,
        overallChance
    };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Prepitus College Chances API is running',
        version: '2.0',
        timestamp: new Date().toISOString()
    });
});

// NEW: Store user info and automatically send report
app.post('/api/store-user-and-send-report', async (req, res) => {
    try {
        const { userData, selectedColleges, formData } = req.body;

        // Validation
        if (!userData || !userData.email || !userData.firstName || !userData.lastName) {
            return res.status(400).json({
                success: false,
                message: 'All user information is required'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        console.log(`📝 Processing user: ${userData.email}`);

        // Store user information with deduplication
        const storageResult = storeUser(userData);
        
        if (!storageResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to store user information'
            });
        }

        // Check if PDF file exists
        if (!fs.existsSync(pdfFilePath)) {
            console.error('❌ PDF file not found:', pdfFilePath);
            return res.status(500).json({
                success: false,
                message: 'Report template not available. Please try again later.'
            });
        }

        // Read the static PDF file
        const pdfBuffer = fs.readFileSync(pdfFilePath);
        console.log('✅ PDF file loaded successfully');

        // Analyze colleges using form data
        const collegeAnalysis = analyzeCollegeChances(formData, selectedColleges);

        // Generate email HTML
        const emailHTML = generateEmailHTML(formData, collegeAnalysis);

        // Send email with PDF attachment
        const mailOptions = {
            from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
            to: userData.email,
            subject: '🎓 Your Personalized College Admission Report & Action Plan - Prepitus',
            html: emailHTML,
            attachments: [
                {
                    filename: `Prepitus_College_Admission_Report_${userData.firstName}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Report sent successfully to: ${userData.email}`);

        res.json({
            success: true,
            message: 'Your college admission report has been sent successfully!',
            data: {
                email: userData.email,
                isDuplicate: storageResult.isDuplicate,
                collegesAnalyzed: selectedColleges.length,
                overallChance: collegeAnalysis.overallChance,
                summary: collegeAnalysis.summary
            }
        });

    } catch (error) {
        console.error('❌ Error storing user and sending report:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to process your request. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Keep existing endpoints for backward compatibility
app.post('/api/send-college-report', async (req, res) => {
    try {
        const { userData, selectedColleges } = req.body;

        // Validation
        if (!userData || !userData.email) {
            return res.status(400).json({
                success: false,
                message: 'Email address is required'
            });
        }

        if (!selectedColleges || selectedColleges.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one college must be selected'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        console.log(`📧 Processing report for: ${userData.email}`);

        // Check if PDF file exists
        if (!fs.existsSync(pdfFilePath)) {
            console.error('❌ PDF file not found:', pdfFilePath);
            return res.status(500).json({
                success: false,
                message: 'Report template not available. Please try again later.'
            });
        }

        // Read the static PDF file
        const pdfBuffer = fs.readFileSync(pdfFilePath);
        console.log('✅ PDF file loaded successfully');

        // Analyze colleges
        const collegeAnalysis = analyzeCollegeChances(userData, selectedColleges);

        // Generate email HTML
        const emailHTML = generateEmailHTML(userData, collegeAnalysis);

        // Send email with PDF attachment
        const mailOptions = {
            from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
            to: userData.email,
            subject: '🎓 Your Personalized College Admission Report & Action Plan - Prepitus',
            html: emailHTML,
            attachments: [
                {
                    filename: `Prepitus_College_Admission_Report_${userData.firstName || 'Student'}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Report sent successfully to: ${userData.email}`);

        res.json({
            success: true,
            message: 'Your college admission report has been sent successfully! Please check your email.',
            data: {
                email: userData.email,
                collegesAnalyzed: selectedColleges.length,
                overallChance: collegeAnalysis.overallChance,
                summary: collegeAnalysis.summary
            }
        });

    } catch (error) {
        console.error('❌ Error sending report:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to send report. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('❌ Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 Prepitus College Chances Backend - v2.0`);
    console.log(`${'='.repeat(60)}`);
    console.log(`🌐 Server running on port: ${PORT}`);
    console.log(`📧 SMTP configured for: ${process.env.SMTP_USER}`);
    console.log(`📄 Using static PDF file: ${pdfFilePath}`);
    console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`\n📍 Available Endpoints:`);
    console.log(`   GET  /api/health - Health check`);
    console.log(`   POST /api/store-user-and-send-report - Store user and send report`);
    console.log(`   POST /api/send-college-report - Send college report (legacy)`);
    console.log(`${'='.repeat(60)}\n`);
});