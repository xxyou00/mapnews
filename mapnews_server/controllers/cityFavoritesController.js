const User = require('../models/userSchema');
const City = require('../models/citySchema');

const cityFavoritesController = {
    async getCities(req, res) {
        try {
            const user = await User.findById(req.user.userId)
                .populate('favorites.cities', 'name');
            
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            res.json(user.favorites.cities);
        } catch (error) {
            console.error('Ошибка при получении избранных городов:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    },

    async addCity(req, res) {
        try {
            const { cityId } = req.params;
            
            const city = await City.findById(cityId);
            if (!city) {
                return res.status(404).json({ message: 'Город не найден' });
            }

            const user = await User.findById(req.user.userId);
            if (!user.favorites.cities.includes(cityId)) {
                user.favorites.cities.push(cityId);
                await user.save();
                res.json({ message: 'Город добавлен в избранное' });
            } else {
                res.status(400).json({ message: 'Город уже в избранном' });
            }
        } catch (error) {
            console.error('Ошибка при добавлении города в избранное:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    },

    async removeCity(req, res) {
        try {
            const { cityId } = req.params;
            const user = await User.findById(req.user.userId);
            
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            user.favorites.cities = user.favorites.cities.filter(id => id.toString() !== cityId);
            await user.save();
            res.json({ message: 'Город удален из избранного' });
        } catch (error) {
            console.error('Ошибка при удалении города из избранного:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
};

module.exports = cityFavoritesController; 