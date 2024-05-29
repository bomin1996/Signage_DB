module.exports = (sequelize, DataTypes) => {
    const EmergencyMessage = sequelize.define('EmergencyMessage', {
        message_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        template_name: DataTypes.STRING(100),
        message_content: DataTypes.TEXT,
        send_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        layout_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Layouts',
                key: 'layout_id'
            }
        }
    }, {
        tableName: 'EmergencyMessages',
        timestamps: false
    });

    return EmergencyMessage;
};
