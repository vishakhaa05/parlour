// API Configuration and Utility Helpers
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('parlour_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers as Record<string, string> || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export { API_BASE_URL };
