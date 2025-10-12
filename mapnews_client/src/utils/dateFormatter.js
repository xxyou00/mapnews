export const formatDate = (dateString) => {
    if (!dateString) return '12:00';
    
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    
    if (dateOnly.getTime() === todayOnly.getTime()) {
        return `Сегодня ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
        return `Вчера ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return `${date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })} ${
        date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
};