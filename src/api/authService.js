import { apiClient } from './apiClient';

let _user = null;

// Try to restore user from localStorage on init
try {
  const storedUser = localStorage.getItem('physci_user');
  if (storedUser) {
    _user = JSON.parse(storedUser);
  }
} catch (e) {
  console.error('Failed to restore user', e);
}

export async function login(email, password) {
  try {
    const data = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    _user = data.user;
    localStorage.setItem('physci_token', data.token);
    localStorage.setItem('physci_user', JSON.stringify(_user));
    
    return { user: _user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

export async function signup(email, password, name) {
  try {
    const data = await apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: name }),
    });
    
    _user = data.user;
    localStorage.setItem('physci_token', data.token);
    localStorage.setItem('physci_user', JSON.stringify(_user));
    
    return { user: _user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

export async function loginWithGoogle() {
  return { user: null, error: 'Google login not implemented yet.' };
}

export async function logout() {
  _user = null;
  localStorage.removeItem('physci_token');
  localStorage.removeItem('physci_user');
  return { error: null };
}

export async function getCurrentUser() {
  return _user;
}

export async function updateProfile(updates) {
  try {
    const data = await apiClient('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    _user = data.user;
    localStorage.setItem('physci_user', JSON.stringify(_user));
    
    return { user: _user, error: null };
  } catch (error) {
    return { user: _user, error: error.message };
  }
}

export async function isUserOnboarded() {
  // Check if department is set
  return !!(_user?.department_id && _user?.level);
}

// Kept for backwards compatibility with UI before we fetch from API
export function getDepartments() {
  return []; 
}

export function setMockUser(user) {
  _user = user;
}
