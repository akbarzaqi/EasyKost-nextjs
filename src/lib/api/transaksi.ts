import { fetchWithAccessToken } from './auth';

const createTransaksi = async (id_tagihan: number) => {
    try {
        const response = await fetchWithAccessToken('/transaksi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_tagihan }),
        });
        return { error: false, data: response.data };
    } catch (error) {
        console.error('[api/transaksi] Error creating transaksi:', error);
        return { error: true, message: 'Gagal membuat transaksi' };
    }
}

export { createTransaksi };
