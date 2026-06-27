import { fetchWithAccessToken } from './auth';

const getMyTagihan = async () => {
    try {
        const response = await fetchWithAccessToken('/tagihan/me', {
            method: 'GET',
        });
        return { error: false, data: response.data || [] };
    } catch (error) {
        console.error('[api/tagihan] Error fetching my tagihan:', error);
        return { error: true, message: 'Gagal memuat tagihan', data: [] };
    }
}

const getAllTagihan = async () => {
    try {
        const response = await fetchWithAccessToken('/tagihan', {
            method: 'GET',
        });
        return { error: false, data: response.data || [] };
    } catch (error) {
        console.error('[api/tagihan] Error fetching all tagihan:', error);
        return { error: true, message: 'Gagal memuat tagihan', data: [] };
    }
}

const getTagihanById = async (id: number) => {
    try {
        const response = await fetchWithAccessToken(`/tagihan/${id}`, {
            method: 'GET',
        });
        return { error: false, data: response };
    } catch (error) {
        console.error('[api/tagihan] Error fetching tagihan:', error);
        return { error: true, message: 'Tagihan tidak ditemukan' };
    }
}

const updateTagihan = async (id: number, data: { air: number; wifi: number; tgl_jatuhtempo: string }) => {
    try {
        const response = await fetchWithAccessToken(`/tagihan/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return { error: false, data: response.data, message: response.message };
    } catch (error) {
        console.error('[api/tagihan] Error updating tagihan:', error);
        return { error: true, message: 'Gagal memperbarui tagihan' };
    }
}

const generateTagihan = async (bulan: string, data: { id_sewa: number; air: number }[]) => {
    try {
        const response = await fetchWithAccessToken('/tagihan/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bulan, data }),
        });
        return { error: false, data: response.data, message: response.message };
    } catch (error) {
        console.error('[api/tagihan] Error generating tagihan:', error);
        return { error: true, message: 'Gagal membuat tagihan' };
    }
}

export { getMyTagihan, getAllTagihan, getTagihanById, updateTagihan, generateTagihan };
