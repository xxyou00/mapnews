const mongoose = require('mongoose');
const News = require('../models/newsSchema');
const Source = require('../models/sourceSchema');

async function deleteKomiInformNews() {
    try {
        await mongoose.connect('mongodb+srv://admin:M1k9MhBwTjHMvnQn@cluster0.eze8dor.mongodb.net/news');
        
        const source = await Source.findOne({ title: 'КомиИнформ' });
        
        if (!source) {
            console.log('Источник КомиИнформ не найден');
            return;
        }

        const result = await News.deleteMany({ source_id: source._id });
        
        console.log(`Удалено ${result.deletedCount} новостей от КомиИнформ`);
        
    } catch (error) {
        console.error('Ошибка при удалении новостей:', error);
    } finally {
        await mongoose.connection.close();
    }
}

deleteKomiInformNews();