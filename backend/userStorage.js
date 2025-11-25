// backend/userStorage.js
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'users.json');

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

function readUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
}

function writeUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing users file:', error);
        return false;
    }
}

function storeUser(userData) {
    const users = readUsers();
    
    // Check for duplicate by email
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
        console.log(`📝 User with email ${userData.email} already exists, skipping duplicate`);
        return { success: true, isDuplicate: true, user: existingUser };
    }
    
    // Add new user with timestamp
    const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        submissionCount: 1
    };
    
    users.push(newUser);
    
    if (writeUsers(users)) {
        console.log(`✅ New user stored: ${userData.email}`);
        return { success: true, isDuplicate: false, user: newUser };
    } else {
        return { success: false, isDuplicate: false, error: 'Failed to store user' };
    }
}

module.exports = {
    storeUser,
    readUsers
};