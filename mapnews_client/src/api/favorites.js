export class FavoritesService {
    static async getFavorites(type) {
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) return [];

            const response = await fetch(`http://localhost:8080/api/favorites/${type}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Ошибка при получении избранных ${type}:`, error);
            return [];
        }
    }

    static async addFavorite(type, itemId) {
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) throw new Error('Не авторизован');

            const response = await fetch(`http://localhost:8080/api/favorites/${type}/${itemId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Ошибка при добавлении в избранное:', error);
            throw error;
        }
    }

    static async removeFavorite(type, itemId) {
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) throw new Error('Не авторизован');

            const response = await fetch(`http://localhost:8080/api/favorites/${type}/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Ошибка при удалении из избранного:', error);
            throw error;
        }
    }
}