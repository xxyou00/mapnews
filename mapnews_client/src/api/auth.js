export class AuthManager {
    constructor() {
        this.token = localStorage.getItem('jwt_token');
        this.isAuthenticated = !!this.token;
    }

    async getUserInfo() {
        if (!this.token) return null;
    
        try {
            const response = await fetch('http://localhost:8080/api/auth/account', {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error('Не удалось получить данные пользователя');
            }
    
            return await response.json();
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
            return null;
        }
    }

    async register(email, password, name) {
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name })
            });

            if (!response.ok) {
                throw new Error('Ошибка регистрации');
            }

            const data = await response.json();
            this.token = data.token;
            this.isAuthenticated = true;
            localStorage.setItem('jwt_token', this.token);
            
            return true;
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            return false;
        }
    }

    async login(email, password) {
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Ошибка авторизации');
            }

            const data = await response.json();
            this.token = data.token;
            this.isAuthenticated = true;
            localStorage.setItem('jwt_token', this.token);
            
            return true;
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
            return false;
        }
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        localStorage.removeItem('jwt_token');
    }

    getToken() {
        return this.token;
    }

    isLoggedIn() {
        return this.isAuthenticated;
    }
}