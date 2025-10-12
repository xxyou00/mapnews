const City = require('../models/citySchema');

exports.getAllCities = async (req, res) => {
    try {
        const cities = await City.find();
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении городов' });
    }
};

exports.getCityById = async (req, res) => {
    try {
        const city = await City.findById(req.params.id);
        if (!city) {
            return res.status(404).json({ message: 'Город не найден' });
        }
        res.json(city);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении города' });
    }
};

exports.createCity = async (req, res) => {
    try {
        const city = new City({
            name: req.body.name
        });
        const savedCity = await city.save();
        res.status(201).json(savedCity);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании города' });
    }
};

exports.updateCity = async (req, res) => {
    try {
        const city = await City.findByIdAndUpdate(
            req.params.id,
            { 
                name: req.body.name,
                imageUrl: req.body.imageUrl,
                coordinates: req.body.coordinates,
                center: req.body.center,
            },
            { new: true }
        );
        if (!city) {
            return res.status(404).json({ message: 'Город не найден' });
        }
        res.json(city);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении города' });
    }
};

exports.deleteCity = async (req, res) => {
    try {
        const city = await City.findByIdAndDelete(req.params.id);
        if (!city) {
            return res.status(404).json({ message: 'Город не найден' });
        }
        res.json({ message: 'Город успешно удален' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении города' });
    }
};
