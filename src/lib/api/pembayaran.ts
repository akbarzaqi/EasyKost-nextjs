import { fetchWithAccessToken } from './auth';

const uploadPembayaran = async (formData: FormData) => {
    try {
        const response = await fetchWithAccessToken('/pembayaran/upload', {
            method: 'POST',
            body: formData,
        });
        return { error: false, data: response.data, message: response.message };
    } catch (error) {
        console.error('[api/pembayaran] Error uploading payment:', error);
        return { error: true, message: 'Gagal mengupload bukti pembayaran' };
    }
}

const getAllPembayaran = async () => {
    try {
        const response = await fetchWithAccessToken('/pembayaran');
        return { error: false, data: response.data };
    } catch (error) {
        console.error('[api/pembayaran] Error fetching all payments:', error);
        return { error: true, message: 'Gagal mengambil data pembayaran' };
    }
}

const getPembayaranByInvoice = async (invoice: string) => {
    try {
        const response = await fetchWithAccessToken(`/pembayaran/${invoice}`);
        return { error: false, data: response };
    } catch (error) {
        console.error('[api/pembayaran] Error fetching payment detail:', error);
        return { error: true, message: 'Gagal mengambil detail pembayaran' };
    }
}

const verifikasiPembayaran = async (id: number, status: 'paid' | 'notpaid') => {
    try {
        const response = await fetchWithAccessToken(`/pembayaran/${id}/verifikasi`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        return { error: false, data: response.data, message: response.message };
    } catch (error) {
        console.error('[api/pembayaran] Error verifying payment:', error);
        return { error: true, message: 'Gagal memverifikasi pembayaran' };
    }
}

const getMyPembayaran = async () => {
    try {
        const response = await fetchWithAccessToken('/pembayaran/me');
        return { error: false, data: response.data };
    } catch (error) {
        console.error('[api/pembayaran] Error fetching my payments:', error);
        return { error: true, message: 'Gagal mengambil riwayat pembayaran' };
    }
}

export { uploadPembayaran, getAllPembayaran, getPembayaranByInvoice, verifikasiPembayaran, getMyPembayaran };
