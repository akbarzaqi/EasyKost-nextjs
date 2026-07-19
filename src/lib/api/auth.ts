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

const fetchWithAccessToken = async (url: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
        'Accept': 'application/json',
    };
    if (options.headers) {
        Object.assign(headers, options.headers);
    }
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`/api/proxy${url}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('Sesi berakhir, silakan login ulang');
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

const register = async (data: { nama: string; username: string; email: string; password: string; password_confirmation: string; no_hp: string }) => {
    return await fetchWithoutAccessToken('/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

const login = async (data: { username: string; password: string }) => {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
            return { error: true, data: null, message: result.message || 'Login gagal' };
        }
        return { error: false, data: result, message: '' };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Login gagal';
        return { error: true, data: null, message };
    }
}

const logoutUser = async () => {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
        console.error('Logout API error:', err);
    }
}

export { fetchWithAccessToken, fetchWithoutAccessToken, register, login, logoutUser };
