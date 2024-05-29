module.exports = (sequelize, DataTypes) => {
    const ContentSetting = sequelize.define('ContentSetting', {
        setting_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Contents',
                key: 'content_id'
            }
        },
        x_position: DataTypes.INTEGER,
        y_position: DataTypes.INTEGER,
        width: DataTypes.INTEGER,
        height: DataTypes.INTEGER,
        effect: DataTypes.STRING(50),
        effect_direction: DataTypes.STRING(50),
        duration: DataTypes.INTEGER
    }, {
        tableName: 'ContentSettings',
        timestamps: false
    });

    return ContentSetting;
};
