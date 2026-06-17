const API_URL = process.env.NEXT_PUBLIC_API_URL;

const setLocalStorageItem = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error(`Error setting localStorage item ${key}:`, error);
    }
}

const fetchWithAccessToken = async (url: string, options: RequestInit = {}) => {
    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
        throw new Error('No access token found');
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
    };

    const response = await fetch(`${API_URL}${url}`, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
}

const fetchWithoutAccessToken = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
}


const register = async (data: { nama : string; username: string; email: string; password: string; password_confirmation: string; no_hp: string }) => {
    console.log('[api/auth] Registering user with data:', data);
    return await fetchWithoutAccessToken('/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

const login = async (data: { username: string; password: string }) => {
    console.log('[api/auth] Logging in user with data:', data);

    try {
        const response = await fetchWithoutAccessToken('/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return { error: false, data: response, message: '' };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Login gagal';
        return { error: true, data: null, message };
    }
}
    
export { fetchWithAccessToken, fetchWithoutAccessToken, register, login, setLocalStorageItem };