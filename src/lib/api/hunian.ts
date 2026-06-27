const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { setLocalStorageItem, fetchWithAccessToken, fetchWithoutAccessToken } from './auth';

const postHunian = async (data: {
    nama_hunian: string;
    tipe_hunian: string;
    status_harian: string;
    gambar_hunian?: File;
    deskripsi_hunian?: string;
    wifi?: number;
    sampah?: number;
    kost?: number;
}) => {
    const formData = new FormData();
    formData.append('nama_hunian', data.nama_hunian);
    formData.append('tipe_hunian', data.tipe_hunian);
    formData.append('status_harian', data.status_harian);
    if (data.gambar_hunian) formData.append('gambar_hunian', data.gambar_hunian);
    if (data.deskripsi_hunian) formData.append('deskripsi_hunian', data.deskripsi_hunian);
    if (data.wifi !== undefined) formData.append('wifi', String(data.wifi));
    if (data.sampah !== undefined) formData.append('sampah', String(data.sampah));
    if (data.kost !== undefined) formData.append('kost', String(data.kost));

    try {
        const response = await fetchWithAccessToken('/hunian', {
            method: 'POST',
            body: formData
        });
        return { error: false, message: 'Hunian berhasil ditambahkan', data: response.data };
    } catch (error) {
        console.error('[api/hunian] Error posting hunian:', error);
        return { error: true, message: 'Gagal menambahkan hunian' };
    }
}

const getAllHunian = async () => {
    try {
        const response = await fetchWithAccessToken('/hunian', {
            method: 'GET',
        });
        return { error: false, data: response.data };
    } catch (error) {
        console.error('[api/hunian] Error fetching all hunian:', error);
        return { error: true, message: 'Gagal memuat data hunian' };
    }
}

const getPublicHunian = async () => {
    try {
        const response = await fetchWithoutAccessToken('/hunian', {
            method: 'GET',
        });
        return { error: false, data: response.data };
    } catch (error) {
        console.error('[api/hunian] Error fetching public hunian:', error);
        return { error: true, message: 'Gagal memuat data hunian' };
    }
}

export { postHunian, getAllHunian, getPublicHunian };



