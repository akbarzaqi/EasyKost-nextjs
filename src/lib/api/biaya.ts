const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { setLocalStorageItem, fetchWithAccessToken, fetchWithoutAccessToken } from './auth';

const postBiaya = async (id: string, data: { wifi: number; sampah: number; kost: number;}) => {
    try {
        const response = await fetchWithAccessToken(`/hunian/${id}/biaya/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return { error: false, message: 'Biaya berhasil ditambahkan', data: response };
    } catch (error) {
        console.error('[api/biaya] Error posting biaya:', error);
        return { error: true, message: 'Gagal menambahkan biaya' };
    }
}

const getBiaya = async (id: string) => {
    try {
        const response = await fetchWithAccessToken(`/hunian/${id}/biaya/`, {
            method: 'GET',
        });
        return { error: false, data: response };
    }catch (error) {
        console.error('[api/biaya] Error fetching biaya:', error);
        return { error: true, message: 'Gagal memuat data biaya' };
    }
}

const updateBiaya = async (id: string, data: { wifi: number; sampah: number; kost: number;}) => {
    try {
        const response = await fetchWithAccessToken(`/hunian/${id}/biaya/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return { error: false, message: 'Biaya berhasil diperbarui', data: response };
    } catch (error) {
        console.error('[api/biaya] Error updating biaya:', error);
        return { error: true, message: 'Gagal memperbarui biaya' };
    }
}

export { postBiaya, getBiaya, updateBiaya };


