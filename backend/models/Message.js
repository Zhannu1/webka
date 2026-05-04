// =============================================
// MESSAGE МОДЕЛІ (Чат хабарламалары кестесі)
// =============================================
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
    // Жіберушінің ID-сі
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // Қабылдаушының ID-сі
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // Хабарлама мәтіні
    message_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    // Оқылды ма?
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

module.exports = Message;
