function formatDate(dateStr) {
    const months = {
        'января': '01', 'февраля': '02', 'марта': '03', 'апреля': '04',
        'мая': '05', 'июня': '06', 'июля': '07', 'августа': '08',
        'сентября': '09', 'октября': '10', 'ноября': '11', 'декабря': '12'
    };

    try {
        if (dateStr.includes('.')) {
            return dateStr;
        }

        const parts = dateStr.trim().split(' ');
        if (parts.length !== 3) {
            console.error('Неверный формат даты:', dateStr);
            return null;
        }

        const [day, month, year] = parts;
        const formattedDay = day.padStart(2, '0');
        const formattedMonth = months[month.toLowerCase()];
        
        if (!formattedMonth) {
            console.error('Неизвестный месяц:', month);
            return null;
        }

        return `${formattedDay}.${formattedMonth}.${year}`;
    } catch (error) {
        console.error('Ошибка при форматировании даты:', dateStr, error);
        return null;
    }
}
module.exports = formatDate; 
