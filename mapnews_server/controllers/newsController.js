const News = require('../models/newsSchema');
const City = require('../models/citySchema');
const Source = require('../models/sourceSchema');

const newsController = {
    async getNews(req, res) {
        try {
            const { city, source, startDate, endDate, page = 1, limit = 10 } = req.query;

            const filter = {};

            if (city) {
                const cityIds = Array.isArray(city) ? city : city.split(',');
                
                const cities = await City.find({ _id: { $in: cityIds } });
                if (cities.length !== cityIds.length) {
                    return res.status(404).json({ message: 'Один или несколько городов не найдены' });
                }
                filter.place_id = { $in: cityIds };
            }

            if (source) {
                const sourceIds = Array.isArray(source) ? source : source.split(',');
                
                const sources = await Source.find({ _id: { $in: sourceIds } });
                if (sources.length !== sourceIds.length) {
                    return res.status(404).json({ message: 'Один или несколько источников не найдены' });
                }
                filter.source_id = { $in: sourceIds };
            }

            if (startDate || endDate) {
                filter.dateTime = {};
                if (startDate) {
                    filter.dateTime.$gte = new Date(startDate);
                }
                if (endDate) {
                    filter.dateTime.$lte = new Date(endDate);
                }
            }

            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);
            const skip = (pageNumber - 1) * limitNumber;

            const news = await News.find(filter)
                .populate('place_id', 'name imageUrl')
                .populate('source_id')
                .sort({ dateTime: -1 })
                .skip(skip)
                .limit(limitNumber);

            const totalNews = await News.countDocuments(filter);

            res.json({
                news,
                total: totalNews,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalNews / limitNumber)
            });
        } catch (error) {
            console.error('Ошибка при получении новостей:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
};

module.exports = newsController; 