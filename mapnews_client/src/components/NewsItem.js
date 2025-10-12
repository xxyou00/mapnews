import { formatDate } from '../utils/dateFormatter.js';
import { FavoritesService } from '../api/favorites.js';
import { AuthManager } from '../api/auth.js';

class NewsItemManager {
    constructor() {
        this.authManager = new AuthManager();
        this.favoriteNews = [];
        this.favoriteCities = [];
        this.favoriteSources = [];
        this.isProcessing = false;
        this.loadFavorites();
        this.initializeLikeHandlers();
    }

    async loadFavorites() {
        this.favoriteNews = await FavoritesService.getFavorites('news');
        this.favoriteCities = await FavoritesService.getFavorites('cities');
        this.favoriteSources = await FavoritesService.getFavorites('sources');
    }

    isNewsLiked(newsId) {
        return this.favoriteNews.some(item => item._id === newsId);
    }

    isCityLiked(cityId) {
        return this.favoriteCities.some(item => item._id === cityId);
    }

    isSourceLiked(sourceId) {
        return this.favoriteSources.some(item => item._id === sourceId);
    }

    async toggleFavorite(type, itemId) {
        try {
            if (this.isNewsLiked(itemId)) {
                await FavoritesService.removeFavorite(type, itemId);
            } else {
                await FavoritesService.addFavorite(type, itemId);
            }
            await this.loadFavorites();
            window.newsManager.updateNews();
        } catch (error) {
            console.error('Ошибка при обновлении избранного:', error);
        }
    }

    createNewsItem(item) {
        return `
            <div class="new__item">
                ${this.createNewsLeft(item)}
                ${this.createNewsRight(item)}
            </div>
        `;
    }

    createNewsLeft(item) {
        return `
            <div class="new__item-left">
                <img src="${item.imageUrl || './src/images/new.png'}" alt="new" class="new__item-img">
                <div class="new__item-img-info">
                    ${this.authManager.isLoggedIn() ? this.createLikeButton(item._id) : ''}
                    ${this.createTimeInfo(item)}
                    ${this.createCityInfo(item)}
                </div>
            </div>
        `;
    }

    createNewsRight(item) {
        return `
            <div class="new__item-right">
                <div class="top__item">
                    <p class="new__title">${item.title || 'Нет заголовка'}</p>
                    <p class="new__text">${item.text || 'Нет текста'}</p>
                </div>
                ${this.createNewsBottom(item)}
            </div>
        `;
    }

    createLikeButton(newsId) {
        return `
            <button data-type="news" data-id="${newsId}" class="new__like-btn ${this.isNewsLiked(newsId) ? 'active' : ''}">
                <img src="./src/images/icons/like.svg" alt="" class="like-img">
            </button>
        `;
    }

    createTimeInfo(item) {
        return `
            <div class="new-time-container">
                <p class="new-time">${formatDate(item.dateTime)}</p>
            </div>
        `;
    }

    createCityInfo(item) {
        return `
            <div class="new-city-container">
                <img src="${item.place_id?.imageUrl || './src/images/komi.png'}" alt="new" class="new-city-img">
                <p class="new-city-title">${item.place_id?.name || 'Коми'}</p>
                ${item.place_id?._id ? `
                    ${this.authManager.isLoggedIn() ? `
                        <button data-type="cities" data-id="${item.place_id._id}" class="new__like-city-btn ${this.isCityLiked(item.place_id._id) ? 'active' : ''}">
                        <img src="./src/images/icons/like.svg" alt="" class="like-city-img">
                        </button>
                    ` : ''}
                ` : ''}
            </div>
        `;
    }

    createNewsBottom(item) {
        return `
            <div class="new__bottom">
                ${this.createSourceInfo(item)}
                ${this.createBottomRight(item)}
            </div>
        `;
    }

    createSourceInfo(item) {
        return `
            <div class="new-source-container">
                <img src="${item.source_id?.imageUrl}" alt="new" class="new-source-img">
                <p class="new-source-title">${item.source_id?.title}</p>
                ${item.source_id?._id ? `
                    ${this.authManager.isLoggedIn() ? `
                        <button data-type="sources" data-id="${item.source_id._id}" class="new__like-source-btn ${this.isSourceLiked(item.source_id._id) ? 'active' : ''}">
                        <img src="./src/images/icons/like.svg" alt="" class="like-source-img">
                        </button>
                    ` : ''}
                ` : ''}
            </div>
        `;
    }

    createBottomRight(item) {
        return `
            <div class="new__bottom__right">
                <div class="share-btn" onclick="clipboard('${item.newsUrl}')">
                    <img src="./src/images/icons/share.png" alt="" class="share-img">
                </div>
                <a href="${item.newsUrl}" class="open-new" target="_blank">Перейти</a>
            </div>
        `;
    }

    initializeLikeHandlers() {
        document.querySelector('.news_container').removeEventListener('click', this.handleLikeClick);
        
        document.querySelector('.news_container').addEventListener('click', this.handleLikeClick.bind(this));
    }

    handleLikeClick = async (event) => {
        const button = event.target.closest('button[data-type]');
        if (!button || this.isProcessing) return; 

        const type = button.dataset.type;
        const itemId = button.dataset.id;

        if (type && itemId) {
            try {
                this.isProcessing = true;
                button.classList.add('processing'); 

                const isCurrentlyLiked = this.isItemLiked(type, itemId);
                button.classList.toggle('active', !isCurrentlyLiked);

                if (isCurrentlyLiked) {
                    await FavoritesService.removeFavorite(type, itemId);
                    this.removeFavoriteLocally(type, itemId);
                } else {
                    await FavoritesService.addFavorite(type, itemId);
                    this.addFavoriteLocally(type, itemId);
                }

            } catch (error) {
                console.error('Ошибка при обновлении избранного:', error);
                button.classList.toggle('active');
            } finally {
                this.isProcessing = false; 
                button.classList.remove('processing'); 
            }
        }
    }

    isItemLiked(type, itemId) {
        switch (type) {
            case 'news':
                return this.isNewsLiked(itemId);
            case 'cities':
                return this.isCityLiked(itemId);
            case 'sources':
                return this.isSourceLiked(itemId);
            default:
                return false;
        }
    }

    addFavoriteLocally(type, itemId) {
        const item = { _id: itemId };
        switch (type) {
            case 'news':
                if (!this.favoriteNews.some(i => i._id === itemId)) {
                    this.favoriteNews.push(item);
                }
                break;
            case 'cities':
                if (!this.favoriteCities.some(i => i._id === itemId)) {
                    this.favoriteCities.push(item);
                }
                break;
            case 'sources':
                if (!this.favoriteSources.some(i => i._id === itemId)) {
                    this.favoriteSources.push(item);
                }
                break;
        }
    }

    removeFavoriteLocally(type, itemId) {
        switch (type) {
            case 'news':
                this.favoriteNews = this.favoriteNews.filter(i => i._id !== itemId);
                break;
            case 'cities':
                this.favoriteCities = this.favoriteCities.filter(i => i._id !== itemId);
                break;
            case 'sources':
                this.favoriteSources = this.favoriteSources.filter(i => i._id !== itemId);
                break;
        }
    }
}

export const newsItemManager = new NewsItemManager();
