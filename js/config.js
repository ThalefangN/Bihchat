// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost/nalediai/backend/api'
    : 'https://your-infinity-free-domain.com/backend/api';

const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: `${API_BASE_URL}/auth/login.php`,
    REGISTER: `${API_BASE_URL}/auth/register.php`,
    
    // Chat endpoints
    CHAT_SEND: `${API_BASE_URL}/chat/send.php`,
    CHAT_HISTORY: `${API_BASE_URL}/chat/history.php`,
    
    // Mood endpoints
    MOOD_CREATE: `${API_BASE_URL}/mood/create.php`,
    MOOD_READ: `${API_BASE_URL}/mood/read.php`,
    MOOD_DELETE: `${API_BASE_URL}/mood/delete.php`
};
