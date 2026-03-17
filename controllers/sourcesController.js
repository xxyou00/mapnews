const Source = require('../models/sourceSchema');

exports.getAllSources = async (req, res) => {
    try {
        const sources = await Source.find();
        res.json(sources);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении источников' });
    }
};

exports.getSourceById = async (req, res) => {
    try {
        const source = await Source.findById(req.params.id);
        if (!source) {
            return res.status(404).json({ message: 'Источник не найден' });
        }
        res.json(source);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении источника' });
    }
};

exports.createSource = async (req, res) => {
    try {
        const source = new Source({
            title: req.body.title,
            imageUrl: req.body.imageUrl,
            siteUrl: req.body.siteUrl,
            description: req.body.description
        });
        const savedSource = await source.save();
        res.status(201).json(savedSource);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании источника' });
    }
};

exports.updateSource = async (req, res) => {
    try {
        const source = await Source.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                imageUrl: req.body.imageUrl,
                siteUrl: req.body.siteUrl,
                description: req.body.description
            },
            { new: true }
        );
        if (!source) {
            return res.status(404).json({ message: 'Источник не найден' });
        }
        res.json(source);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении источника' });
    }
};

exports.deleteSource = async (req, res) => {
    try {
        const source = await Source.findByIdAndDelete(req.params.id);
        if (!source) {
            return res.status(404).json({ message: 'Источник не найден' });
        }
        res.json({ message: 'Источник успешно удален' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении источника' });
    }
};
