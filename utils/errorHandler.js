const handleError = (res, error, message) => {
    console.error(message, error);
    res.status(500).json({ message: 'Ошибка сервера' });
};

module.exports = handleError; 