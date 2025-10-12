export const fetchNews = async (params) => {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.cities && params.cities.length > 0) {
            params.cities.forEach(city => queryParams.append('city', city));
        }
        if (params.sources && params.sources.length > 0) {
            params.sources.forEach(source => queryParams.append('source', source));
        }
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const url = `http://localhost:8080/api/news?${queryParams.toString()}`;

        const response = await fetch(url, {
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
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при получении новостей:', error);
        return {
            news: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
        };
    }
};

export const fetchCities = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/cities', {
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
        
        const cities = await response.json();
        return cities;
    } catch (error) {
        console.error('Ошибка при получении данных городов:', error);
        document.getElementById('preloader').classList.add('hidden');
        return [];
    }
};

export const fetchSources = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/sources', {
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
        
        const sources = await response.json();
        return sources;
    } catch (error) {
        console.error('Ошибка при получении данных источников:', error);
        document.getElementById('preloader').classList.add('hidden');
        return [];
    }
};
