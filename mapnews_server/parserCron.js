const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');

const Source = require('./models/sourceSchema');
const News = require('./models/newsSchema');
const City = require('./models/citySchema');
const formatDate = require('./utils/formatDateKI');

const cityMapping = {
    2: 'Сыктывкар',
    4: 'Печора',
    5: 'Воркута',
    6: 'Ухта',
    7: 'Усинск',
    8: 'Инта',
    9: 'Сосногорск',
    10: 'Вуктыл',
    11: 'Сыктывдинский',
    12: 'Прилузский',
    13: 'Койгородский',
    14: 'Удорский',
    15: 'Княжпогостский',
    16: 'Корткеросский',
    17: 'Усть-Куломский',
    18: 'Усть-Вымский',
    19: 'Троицко-Печорский',
    20: 'Усть-Цилемский',
    21: 'Сысольский',
    22: 'Ижемский'
};

async function parseNewsKI() {
    try {
        const URL = 'https://komiinform.ru';
        const { data } = await axios.get(URL);
        const $ = cheerio.load(data);

        const source = await Source.findOne({ title: 'КомиИнформ' });

        const today = new Date();
        let currentDate = today.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const elements = $('.b-news > div').toArray();

        for (const element of elements) {
            const $element = $(element);
            
            if ($element.hasClass('dateHeader')) {
                const dateText = $element.text().trim();
                const rawDate = dateText.split(',')[0];
                currentDate = formatDate(rawDate);
                continue;
            }

            if ($element.hasClass('row') && $element.hasClass('item')) {
                const time = $element.find('.category-label').first().text().trim();
                const title = $element.find('.smallHeader2').text().trim();
                const text = $element.find('.strip-content').text().trim();
                const imageUrl = $element.find('.preview__wrap a').attr('href') ? 
                    URL + $element.find('.preview__wrap a').attr('href') : null;
                const newsUrl = URL + $element.find('.smallHeader2').attr('href');
                const place = $element.find('.city a').first().text().trim() || 'Не указано';

                const city = await City.findOne({ name: place });
                const place_id = city ? city._id : null;

                if (currentDate && time) {
                    const [hours, minutes] = time.split(':').map(Number);
                    const [day, month, year] = currentDate.split('.').map(Number);
                    const dateTime = new Date(year, month - 1, day, hours || 0, minutes || 0);

                    const existingNews = await News.findOne({ title });
                    if (!existingNews) {
                        await News.create({ 
                            title, text, imageUrl, newsUrl, place_id, 
                            dateTime: dateTime, source_id: source._id 
                        });
                        console.log('Добавлена новость КомиИнформ:', title);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Ошибка парсинга КомиИнформ:', error);
    }
}

async function parseNewsBNK(cityId) {
    try {
        const URL = `https://www.bnkomi.ru/data/city/${cityId}`;
        const { data } = await axios.get(URL);
        const $ = cheerio.load(data);

        const source = await Source.findOne({ title: 'БНК Коми' });

        $('.b-news-list .item').each(async (_, element) => {
            const dateTime = $(element).find('.date').text().trim();
            const [time, date] = dateTime.split(',').map(s => s.trim());
            const title = $(element).find('.title a').text().trim();
            const text = $(element).find('.short-content p').text().trim();
            const imageUrl = $(element).find('.pic').attr('src') ? `https://www.bnkomi.ru${$(element).find('.pic').attr('src') || ''}` : null;
            const newsUrl = `https://www.bnkomi.ru${$(element).find('.title a').attr('href')}`;
            const place = cityMapping[cityId] || 'Не указано';

            const city = await City.findOne({ name: place });
            const place_id = city ? city._id : null;

            const [hours, minutes] = time.split(':').map(Number);
            const [day, month, year] = date.split('.').map(Number);
            const dateTimeObj = new Date(year, month - 1, day, hours || 0, minutes || 0);

            if (isNaN(dateTimeObj.getTime())) {
                console.error('Некорректная дата:', { date, time, dateTimeObj });
                return;
            }

            const existingNews = await News.findOne({ title });
            if (!existingNews) {
                await News.create({ 
                    title, text, imageUrl, newsUrl, place_id, 
                    dateTime: dateTimeObj, source_id: source._id 
                });
                console.log('Добавлена новость БНК Коми:', title);
            }
        });
    } catch (error) {
        console.error(`Ошибка парсинга БНК Коми (город ${cityId}):`, error);
    }
}

async function parseAllBNKCities() {
    const cityIds = Object.keys(cityMapping);
    for (const cityId of cityIds) {
        await parseNewsBNK(cityId);
    }
}

async function parseNewsAIF() {
    try {
        const URL = 'https://komi.aif.ru/news';
        const { data } = await axios.get(URL);
        const $ = cheerio.load(data);

        const source = await Source.findOne({ title: 'Аргументы и факты' });

        $('.list_item').each(async (_, element) => {
            const time = $(element).find('.text_box__date').text().trim();
            const title = $(element).find('.item_text__title').first().text().trim();
            const text = $(element).find('.text_box span:not(.item_text__title, .text_box__date)').text().trim();
            const imageUrl = $(element).find('.img_box img').attr('src') || '';
            const newsUrl = $(element).find('.text_box .box_info a').attr('href');
            
            const now = new Date();
            const [hours, minutes] = time.split(':').map(Number);
            const dateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours || 0, minutes || 0);

            const place_id = null;

            const existingNews = await News.findOne({ title });
            if (!existingNews) {
                await News.create({ 
                    title, text, imageUrl, newsUrl, place_id, 
                    dateTime, source_id: source._id,
                });
                console.log('Добавлена новость АиФ:', title);
            }
        });
    } catch (error) {
        console.error('Ошибка парсинга АиФ:', error);
    }
}

async function parseNewsKomiOnline() {
    try {
        const URL = 'https://komionline.ru/lenta/news';
        const { data } = await axios.get(URL);
        const $ = cheerio.load(data);

        const source = await Source.findOne({ title: 'КомиОнлайн' });

        $('.row:not(.adv-row, .page-pagination) .news-block').each(async (_, element) => {
            const dateTimeStr = $(element).find('.news-stat').text().trim();
            const parts = dateTimeStr.split('|');
            
            if (!parts[1]) return false;

            const dateTimeParts = parts[1].trim().split(', ');
            const [day, month, year, time] = dateTimeParts[1].split(' ').concat(dateTimeParts[2], dateTimeParts[3]);
            
            const [hours, minutes] = time.split(':').map(Number);
            const monthNum = getMonthNumber(month);
            const yearNum = parseInt(year);
            
            const dateTime = new Date(yearNum, monthNum - 1, parseInt(day), hours, minutes);

            const newsBlock = $(element).find('.news-item');
            const title = newsBlock.find('.news-title').text().trim();
            const text = newsBlock.find('.news-text').text().trim();
            if (text.startsWith('Реклама.')) return false;
            const newsUrl = newsBlock.find('a').first().attr('href');
            const imageUrl = newsBlock.find('.news-img-top').attr('src') || '';

            const place = 'Не указано';
            const city = await City.findOne({ name: place });
            const place_id = city ? city._id : '67c6daa3df22ee245ac32e69';

            const existingNews = await News.findOne({ title });
            if (!existingNews) {
                await News.create({ 
                    title, text, imageUrl, newsUrl, place_id, 
                    dateTime, source_id: source._id,
                });
                console.log('Добавлена новость КомиОнлайн:', title);
            }
        });
    } catch (error) {
        console.error('Ошибка парсинга КомиОнлайн:', error);
    }
}

function getMonthNumber(monthStr) {
    const months = {
        'января': 1, 'февраля': 2, 'марта': 3, 'апреля': 4,
        'мая': 5, 'июня': 6, 'июля': 7, 'августа': 8,
        'сентября': 9, 'октября': 10, 'ноября': 11, 'декабря': 12
    };
    return months[monthStr.toLowerCase()] || 1;
}

// 每 10 分钟执行一次爬虫
cron.schedule('*/10 * * * *', () => {
    console.log('Запуск парсинга...');
    parseNewsKI();
    parseAllBNKCities();
    parseNewsKomiOnline();
    parseNewsAIF();
});

// 每天凌晨 3 点清理超过 1 年的旧新闻
cron.schedule('0 3 * * *', async () => {
    try {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const result = await News.deleteMany({ dateTime: { $lt: oneYearAgo } });
        console.log(`Очистка: удалено ${result.deletedCount} новостей старше 1 года`);
    } catch (error) {
        console.error('Ошибка очистки старых новостей:', error);
    }
});

console.log('Cron парсер инициализирован (парсинг: каждые 10 мин, очистка: ежедневно в 03:00)');
