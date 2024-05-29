module.exports = (sequelize, DataTypes) => {
    const TextSetting = sequelize.define('TextSetting', {
        text_setting_id: {
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
        font_family: DataTypes.STRING(50),
        font_size: DataTypes.INTEGER,
        color: DataTypes.STRING(20),
        background_color: DataTypes.STRING(20),
        bold: DataTypes.BOOLEAN,
        italic: DataTypes.BOOLEAN,
        underline: DataTypes.BOOLEAN,
        x_position: DataTypes.INTEGER,
        y_position: DataTypes.INTEGER,
        width: DataTypes.INTEGER,
        height: DataTypes.INTEGER
    }, {
        tableName: 'TextSettings',
        timestamps: false
    });

    return TextSetting;
};
