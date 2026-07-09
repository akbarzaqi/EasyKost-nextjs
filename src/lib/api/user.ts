import { fetchWithAccessToken } from './auth';

const updateProfile = async (data: {
    nama: string;
    email: string;
    no_hp?: string;
    pekerjaan?: string;
    provinsi?: string;
    kabupaten?: string;
    kecamatan?: string;
    alamat?: string;
}) => {
    try {
        const response = await fetchWithAccessToken('/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response) {
            return { error: true, message: 'Gagal terhubung ke server, silakan coba lagi' };
        }
        return { error: false, message: response.message || 'Profil berhasil diperbarui', data: response.data };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Gagal memperbarui profil';
        console.error('[updateProfile] Error:', message);
        return { error: true, message };
    }
}

const updateFoto = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('foto', file);

        const response = await fetchWithAccessToken('/profile/foto', {
            method: 'POST',
            body: formData,
        });
        if (!response) {
            return { error: true, message: 'Gagal terhubung ke server, silakan coba lagi' };
        }
        return { error: false, message: response.message || 'Foto berhasil diperbarui', data: response.data };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Gagal memperbarui foto';
        return { error: true, message };
    }
}

const getAllUsers = async () => {
    try {
        const response = await fetchWithAccessToken('/users');
        return { error: false, data: response.data };
    } catch (error) {
        console.error('[api/user] Error fetching users:', error);
        return { error: true, message: 'Gagal memuat data pengguna' };
    }
}

const deleteUser = async (id: number) => {
    try {
        const response = await fetchWithAccessToken(`/users/${id}`, {
            method: 'DELETE',
        });
        return { error: false, message: response.message || 'User berhasil dihapus' };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Gagal menghapus user';
        return { error: true, message };
    }
}

export { updateProfile, updateFoto, getAllUsers, deleteUser };
