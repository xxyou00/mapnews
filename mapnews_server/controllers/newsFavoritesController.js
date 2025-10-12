const User = require('../models/userSchema');
const News = require('../models/newsSchema');

const newsFavoritesController = {
    async getNews(req, res) {
        try {
            const user = await User.findById(req.user.userId)
                .populate({
                    path: 'favorites.news',
                    populate: [
                        { path: 'place_id' },
                        { path: 'source_id' }
                    ]
                });
            
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            res.json(user.favorites.news);
        } catch (error) {
            console.error('Ошибка при получении избранных новостей:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    },

    async addNews(req, res) {
        try {
            const { newsId } = req.params;
            
            const news = await News.findById(newsId);
            if (!news) {
                return res.status(404).json({ message: 'Новость не найдена' });
            }

            const user = await User.findById(req.user.userId);
            if (!user.favorites.news.includes(newsId)) {
                user.favorites.news.push(newsId);
                await user.save();
                res.json({ message: 'Новость добавлена в избранное' });
            } else {
                res.status(400).json({ message: 'Новость уже в избранном' });
            }
        } catch (error) {
            console.error('Ошибка при добавлении новости в избранное:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    },

    async removeNews(req, res) {
        try {
            const { newsId } = req.params;
            const user = await User.findById(req.user.userId);
            
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            user.favorites.news = user.favorites.news.filter(id => id.toString() !== newsId);
            await user.save();
            res.json({ message: 'Новость удалена из избранного' });
        } catch (error) {
            console.error('Ошибка при удалении новости из избранного:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
};

module.exports = newsFavoritesController; 