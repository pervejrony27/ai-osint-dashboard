const API_BASE_URL = 'http://localhost:8000';

export const api = {
  scan: async (target) => {
    const response = await fetch(`${API_BASE_URL}/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ target }),
    });
    return response.json();
  },
};