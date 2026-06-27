'use client';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const translateValidation = (msg: string): string => {
    const map: Record<string, string> = {
        'has already been taken': 'sudah digunakan',
        'must be at least 8 characters': 'minimal 8 karakter',
        'does not match': 'tidak cocok',
        'is required': 'wajib diisi',
        'is invalid': 'tidak valid',
        'not found': 'tidak ditemukan',
        'The given data was invalid': 'Data yang diberikan tidak valid',
        'validation.confirmed': 'Konfirmasi password tidak cocok',
        'validation.min.string': 'minimal :min karakter',
        'validation.unique': 'sudah digunakan',
    };
    for (const [en, id] of Object.entries(map)) {
        if (msg.toLowerCase().includes(en.toLowerCase())) return id;
    }
    // Capitalize common patterns
    return msg
        .replace(/^The /, '')
        .replace(/ field is required/g, ' wajib diisi')
        .replace(/ has already been taken\.?/g, ' sudah digunakan')
        .replace(/ must be at least (\d+) characters\.?/g, ' minimal $1 karakter')
        .replace(/ confirmation does not match\.?/g, ' tidak cocok');
}


const fieldLabels: Record<string, string> = {
    username: 'Username',
    email: 'Email',
    password: 'Password',
    nama: 'Nama',
    no_hp: 'No. HP',
};

const formatErrors = (errors: Record<string, string[]>): string =>
    Object.entries(errors)
        .map(([field, msgs]) => {
            const label = fieldLabels[field] || field;
            return `${label} ${msgs.map(m => translateValidation(m)).join(', ')}`;
        })
        .join(', ');

const setLocalStorageItem = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error(`Error setting localStorage item ${key}:`, error);
    }
}

const clearLocalStorageItem = () => {
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    } catch (error) {
        console.error('Error removing localStorage items:', error);
    }
}

const fetchWithAccessToken = async (url: string, options: RequestInit = {}) => {
    
    

    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
        throw new Error('No access token found');
    }

    const headers = {
        'Accept': 'application/json',
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
    };

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
        redirect: 'manual',
    });

    if (response.type === 'opaqueredirect' || response.status === 302 || response.status === 301) {
        clearLocalStorageItem();
        window.location.href = '/login';
        return;
    }

    if (response.status === 401) {
        clearLocalStorageItem();
        window.location.href = '/login';
        return;
    }

    if (!response.ok) {
        const text = await response.text();
        let message: string;
        try {
            const data = JSON.parse(text);
            if (data.errors) {
                message = formatErrors(data.errors);
            } else {
                message = translateValidation(data.message || `HTTP error! status: ${response.status}`);
            }
        } catch {
            message = `HTTP error! status: ${response.status}`;
        }
        console.error('[fetchWithAccessToken] Error:', response.status, message);
        throw new Error(message);
    }

    const data = await response.json();
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
        let message = data.message || `HTTP error! status: ${response.status}`;
        if (data.errors) {
            message = formatErrors(data.errors);
        } else {
            message = translateValidation(message);
        }
        throw new Error(message);
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
    
const logoutUser = async () => {
    try {
        await fetchWithAccessToken('/logout', { method: 'POST' });
    } catch (err) {
        console.error('Logout API error:', err);
    }
}

export { fetchWithAccessToken, fetchWithoutAccessToken, register, login, logoutUser, setLocalStorageItem };