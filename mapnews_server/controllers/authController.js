const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const authController = {
    async register(req, res) {
        try {
            const { email, name, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                email,
                name,
                password: hashedPassword,
                favorites: { news: [], sources: [], cities: [] }
            });

            await newUser.save();

            const token = jwt.sign(
                { userId: newUser._id, email: newUser.email }, 
                JWT_SECRET, 
                { expiresIn: '6h' }
            );

            res.status(201).json({ 
                message: 'Пользователь успешно зарегистрирован',
                token 
            });
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Неверный пароль' });
            }

            const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '6h' });

            res.json({ token });
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    },

    async account(req, res) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'Отсутствует токен авторизации' });
            }

            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Неверный формат токена' });
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            res.json(user);
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Недействительный токен' });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Срок действия токена истек' });
            }
            
            console.error('Ошибка при получении информации о пользователе:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
};

module.exports = authController; 