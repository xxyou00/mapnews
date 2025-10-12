import { fetchNews } from '../api/news.js';
import { newsItemManager } from './NewsItem.js';

export class NewsManager {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 1;
        this.selectedCities = [];
        this.selectedSources = [];
        this.initializeListeners();
    }

    initializeListeners() {
        document.getElementById('date-start').addEventListener('change', () => this.updateNews());
        document.getElementById('date-end').addEventListener('change', () => this.updateNews());
        
        document.getElementById('prev-page').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.updateNews(this.currentPage - 1);
            }
        });

        document.getElementById('next-page').addEventListener('click', () => {
            if (this.currentPage < this.totalPages) {
                this.updateNews(this.currentPage + 1);
            }
        });
    }

    async updateNews(page = 1) {
        const startDate = document.getElementById('date-start').value;
        const endDate = document.getElementById('date-end').value;

        const response = await fetchNews({
            cities: this.selectedCities,
            sources: this.selectedSources,
            startDate: startDate ? new Date(startDate).toISOString() : undefined,
            endDate: endDate ? new Date(endDate + 'T23:59:59.999Z').toISOString() : undefined,
            page,
            limit: 10
        });

        await newsItemManager.loadFavorites();

        this.updatePagination(response);
        this.renderNews(response.news);
        newsItemManager.initializeLikeHandlers();
    }

    updatePagination(response) {
        this.currentPage = response.page;
        this.totalPages = response.totalPages;

        document.getElementById('current-page').textContent = this.currentPage;
        document.getElementById('total-pages').textContent = this.totalPages;
        
        document.getElementById('prev-page').disabled = this.currentPage <= 1;
        document.getElementById('next-page').disabled = this.currentPage >= this.totalPages;
    }

    renderNews(news) {
        const newsContainer = document.querySelector('.news_container');
        newsContainer.innerHTML = '';

        if (!Array.isArray(news)) {
            console.error('Полученные данные не являются массивом:', news);
            return;
        }

        news.forEach(item => {
            if (item && typeof item === 'object') {
                newsContainer.insertAdjacentHTML('beforeend', newsItemManager.createNewsItem(item));
            }
        });
    }

    updateCity(cityId, isActive) {
        if (isActive) {
            this.selectedCities = this.selectedCities.filter(id => id !== cityId);
        } else {
            this.selectedCities.push(cityId);
        }
        this.updateNews();
    }

    updateSource(sourceId, isActive) {
        if (isActive) {
            this.selectedSources = this.selectedSources.filter(id => id !== sourceId);
        } else {
            this.selectedSources.push(sourceId);
        }
        this.updateNews();
    }
}
