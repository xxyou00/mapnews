const User = require('../models/userSchema');
const Source = require('../models/sourceSchema');

const sourceFavoritesController = {
    async getSources(req, res) {
        try {
            const user = await User.findById(req.user.userId)
                .populate('favorites.sources', 'title');
            
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            res.json(user.favorites.sources);
        } catch (error) {
            console.error('Ошибка при получении избранных источников:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    },

    async addSource(req, res) {
        try {
            const { sourceId } = req.params;
            
            const source = await Source.findById(sourceId);
            if (!source) {
                return res.status(404).json({ message: 'Источник не найден' });
            }

            const user = await User.findById(req.user.userId);
            if (!user.favorites.sources.includes(sourceId)) {
                user.favorites.sources.push(sourceId);
                await user.save();
                res.json({ message: 'Источник добавлен в избранное' });
            } else {
                res.status(400).json({ message: 'Источник уже в избранном' });
            }
        } catch (error) {
            console.error('Ошибка при добавлении источника в избранное:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    },

    async removeSource(req, res) {
        try {
            const { sourceId } = req.params;
            const user = await User.findById(req.user.userId);
            
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            user.favorites.sources = user.favorites.sources.filter(id => id.toString() !== sourceId);
            await user.save();
            res.json({ message: 'Источник удален из избранного' });
        } catch (error) {
            console.error('Ошибка при удалении источника из избранного:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
};

module.exports = sourceFavoritesController; 