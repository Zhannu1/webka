const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const sequelize = require('./config/database');
const User = require('./models/User');
const Vacancy = require('./models/Vacancy');
const Notification = require('./models/Notification');
const Message = require('./models/Message');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role: role || 'user' });
        res.status(201).json({ message: 'User registered', user: { id: user.id, name, email, role: user.role } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- VACANCY ROUTES ---

app.get('/api/vacancies', async (req, res) => {
    try {
        const vacancies = await Vacancy.findAll({ order: [['createdAt', 'DESC']] });
        res.json(vacancies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/vacancies', async (req, res) => {
    try {
        const vacancy = await Vacancy.create(req.body);
        res.status(201).json(vacancy);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/vacancies/:id', async (req, res) => {
    try {
        await Vacancy.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Vacancy deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- USER MANAGEMENT (Admin) ---

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.destroy({ where: { id: req.params.id } });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- NOTIFICATION ROUTES ---

app.get('/api/notifications/:user_id', async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { user_id: req.params.user_id },
            order: [['createdAt', 'DESC']]
        });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/notifications/:id/read', async (req, res) => {
    try {
        await Notification.update({ is_read: true }, { where: { id: req.params.id } });
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- MESSAGE ROUTES ---

app.get('/api/messages/:sender_id/:receiver_id', async (req, res) => {
    const { sender_id, receiver_id } = req.params;
    try {
        const { Op } = require('sequelize');
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { sender_id, receiver_id },
                    { sender_id: receiver_id, receiver_id: sender_id }
                ]
            },
            order: [['createdAt', 'ASC']]
        });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Барлық хабарламаларды оқылды деп белгілеу (белгілі бір жіберушіден)
app.patch('/api/messages/read/:sender_id/:receiver_id', async (req, res) => {
    try {
        await Message.update({ is_read: true }, {
            where: {
                sender_id: req.params.sender_id,
                receiver_id: req.params.receiver_id,
                is_read: false
            }
        });
        res.json({ message: 'Messages marked as read' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Оқылмаған хабарламалар санын алу
app.get('/api/messages/unread-counts/:user_id', async (req, res) => {
    try {
        const counts = await Message.findAll({
            attributes: [
                'sender_id',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: {
                receiver_id: req.params.user_id,
                is_read: false
            },
            group: ['sender_id']
        });
        res.json(counts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/messages', async (req, res) => {
    try {
        const { message_text } = req.body;
        
        if (!message_text) {
            return res.status(400).json({ error: 'Хабарлама мәтіні бос болмауы керек!' });
        }

        // Шектеу: 100 таңбадан аспауы керек
        if (message_text.length > 100) {
            return res.status(400).json({ error: 'Хабарлама 100 таңбадан аспауы керек!' });
        }

        const message = await Message.create(req.body);
        res.status(201).json(message);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Sync database and start server
const isDev = process.env.NODE_ENV === 'development';
if (process.env.NODE_ENV !== 'test') {
    sequelize.sync({ force: isDev }).then(async () => {
    const bcrypt = require('bcryptjs');

    // --- Admin аккаунтын жасау ---
    await User.create({
        name: 'Admin',
        email: 'admin@jobportal.kz',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin'
    });
    console.log('✅ Admin жасалды: admin@jobportal.kz / admin123');

    // --- Вакансияларды қосу ---
    const vacancyCount = await Vacancy.count();
    if (vacancyCount === 0) {
        await Vacancy.bulkCreate([
            {
                title: 'Аға Frontend Әзірлеуші',
                company: 'Google',
                salary: '850,000 ₸',
                img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80',
                phone: '+7 (701) 111 22 33',
                email: 'hr@google.com'
            },
            {
                title: 'Java Backend Маманы',
                company: 'Kaspi.kz',
                salary: '700,000 ₸',
                img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=500&q=80',
                phone: '+7 (777) 555 44 33',
                email: 'job@kaspi.kz'
            },
            {
                title: 'UI/UX Дизайнер',
                company: 'Apple',
                salary: '550,000 ₸',
                img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=500&q=80',
                phone: '+7 (700) 999 88 77',
                email: 'design@apple.com'
            },
            {
                title: 'QA Инженер (Тестілеуші)',
                company: 'Meta',
                salary: '600,000 ₸',
                img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80',
                phone: '+7 (747) 123 45 67',
                email: 'qa.careers@meta.com'
            },
            {
                title: 'DevOps Инженер',
                company: 'Amazon',
                salary: '950,000 ₸',
                img: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=500&q=80',
                phone: '+7 (705) 000 11 22',
                email: 'cloud.jobs@amazon.com'
            },
            {
                title: 'Data Scientist',
                company: 'Yandex',
                salary: '800,000 ₸',
                img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80',
                phone: '+7 (701) 987 65 43',
                email: 'data.team@yandex.kz'
            },
            {
                title: 'iOS Әзірлеуші',
                company: 'Kolesa Group',
                salary: '750,000 ₸',
                img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=500&q=80',
                phone: '+7 (778) 555 12 34',
                email: 'hr@kolesa.kz'
            },
            {
                title: 'Android Әзірлеуші',
                company: 'BTS Digital',
                salary: '700,000 ₸',
                img: 'https://images.unsplash.com/photo-1607252656733-fd7458e278f6?auto=format&fit=crop&w=500&q=80',
                phone: '+7 (702) 222 33 44',
                email: 'recruitment@btsdigital.kz'
            },
            {
                title: 'Жоба Менеджері (PM)',
                company: 'Chocofamily',
                salary: '650,000 ₸',
                img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=80',
                phone: '+7 (707) 333 99 88',
                email: 'pm.hunt@chocofamily.kz'
            },
            {
                title: 'Киберқауіпсіздік маманы',
                company: 'Halyk Bank',
                salary: '900,000 ₸',
                img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80',
                phone: '+7 (700) 777 00 11',
                email: 'security@halykbank.kz'
            }
        ]);
        console.log('✅ 10 вакансия деректер базасына қосылды!');
    }

    // --- Тест хабарландыру мен чат хабарламасын қосу ---
    const admin = await User.findOne({ where: { email: 'admin@jobportal.kz' } });
    if (admin) {
        await Notification.create({
            user_id: admin.id,
            title: 'Жүйеге қош келдіңіз!',
            message: 'Сіздің аккаунтыңыз сәтті белсендірілді.',
            is_read: false
        });
        await Message.create({
            sender_id: 2, // Мысалы, басқа пайдаланушы
            receiver_id: admin.id,
            message_text: 'Сәлем! Менің түйіндемемді көрдіңіз бе?'
        });
        console.log('✅ Тест хабарландыру мен хабарлама жасалды!');
    }

    if (process.env.NODE_ENV !== 'test') {
        app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
    }
    }).catch(err => console.log('❌ DB Connection Error:', err));
}

module.exports = app;
