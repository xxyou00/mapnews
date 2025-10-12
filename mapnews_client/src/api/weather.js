export class WeatherManager {
    async fetchWeather() {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=2f66a0a738be42acac6101415250803&q=Syktyvkar`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'omit',
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const weather = await response.json();
            return {
                temp: weather.current.temp_c,
                icon: weather.current.condition.icon
            };
        } catch (error) {
            console.error('Ошибка при получении данных источников:', error);
            console.log('Проверьте, что сервер запущен на http://localhost:8080');
            return {
                temp: 0,
                icon: './src/images/icons/weather.png'
            };
        }
    };
}