import { BASE_URL } from '@/api/axios';

export const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/600x400?text=No+Image';
    
    // If it's already a full URL, return it
    if (path.startsWith('http')) return path;
    
    // Handle Laravel storage path
    // Usually images are in storage/ (which maps to public/storage/)
    // If the path already includes 'storage/', don't add it again
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    if (cleanPath.startsWith('storage/')) {
        return `${BASE_URL}/${cleanPath}`;
    }
    
    return `${BASE_URL}/storage/${cleanPath}`;
};
