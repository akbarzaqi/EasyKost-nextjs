import { fetchWithAccessToken } from './auth';

const createSewa = async (data: { id_hunian: number; tgl_jatuhtempo: string }) => {
    try {
        const response = await fetchWithAccessToken('/sewa', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return { error: false, message: response.message || 'Sewa berhasil diajukan', data: response.data };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Gagal mengajukan sewa';
        return { error: true, message };
    }
}

const getSewaById = async (id: number) => {
    try {
        const response = await fetchWithAccessToken(`/sewa/${id}`, {
            method: 'GET',
        });
        return { error: false, data: response.data || response };
    } catch (error) {
        console.error('[api/sewa] Error fetching sewa:', error);
        return { error: true, message: 'Gagal memuat data sewa' };
    }
}

const getMySewa = async () => {
    try {
        const response = await fetchWithAccessToken('/sewa/me', {
            method: 'GET',
        });
        return { error: false, data: response.data || response };
    } catch (error) {
        console.error('[api/sewa] Error fetching my sewa:', error);
        return { error: true, message: 'Belum memiliki sewa aktif' };
    }
}

const getAllSewa = async () => {
    try {
        const response = await fetchWithAccessToken('/sewa', {
            method: 'GET',
        });
        return { error: false, data: response.data };
    } catch (error) {
        console.error('[api/sewa] Error fetching all sewa:', error);
        return { error: true, message: 'Gagal memuat data sewa' };
    }
}

const updateSewa = async (id: number, data: { status: string; tgl_jatuhtempo?: string }) => {
    try {
        const response = await fetchWithAccessToken(`/sewa/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return { error: false, message: response.message || 'Sewa berhasil diperbarui', data: response.data };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Gagal memperbarui sewa';
        return { error: true, message };
    }
}

export { createSewa, getSewaById, getMySewa, getAllSewa, updateSewa };
