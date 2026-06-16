const API_URL = process.env.API_URL;

const fetchWithAccessToken = async (url: string, options: RequestInit = {}) => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        throw new Error('No access token found');
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
    };

    const response = await fetch(`${API_URL}${url}`, { ...options, headers });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

const fetchWithoutAccessToken = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_URL}${url}`, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

const register = async (data: { nama : string; email: string; password: string; password_confirmation: string; no_hp: string }) => {
    return await fetchWithoutAccessToken('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}
    
export { fetchWithAccessToken, fetchWithoutAccessToken, register };