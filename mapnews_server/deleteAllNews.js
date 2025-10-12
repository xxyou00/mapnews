const mongoose = require('mongoose');
const News = require('./models/newsSchema');

const MONGO_URI = 'mongodb+srv://admin:M1k9MhBwTjHMvnQn@cluster0.eze8dor.mongodb.net/news';

async function deleteAllNews() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB подключен');

        const result = await News.deleteMany({});
        console.log(`Удалено ${result.deletedCount} новостей`);

        await mongoose.disconnect();
        console.log('MongoDB отключен');

        process.exit(0);
    } catch (error) {
        console.error('Ошибка при удалении новостей:', error);
        process.exit(1);
    }
}

deleteAllNews();
