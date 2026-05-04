// =============================================
// NOTIFICATIONS МОДЕЛІ (Хабарландырулар кестесі)
// =============================================
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
    // Хабарландыруды алатын қолданушының ID-сі
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // Хабарландырудың тақырыбы (мысалы: "Жаңа вакансия!")
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Хабарландырудың мазмұны
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    // Оқылды ма? (true = оқылды, false = оқылмаған)
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    // createdAt, updatedAt автоматты қосылады
    timestamps: true
});

module.exports = Notification;
