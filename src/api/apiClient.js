const API_URL = import.meta.env.VITE_API_URL || 'https://physci-hub-api.samadoye28.workers.dev/api';

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('physci_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // If body is FormData, don't set Content-Type manually
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (networkError) {
    throw new Error(`Network Error: Unable to connect to the server. Please check your internet connection.`);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API request failed: ${response.status}`);
  }

  return response.json();
};
