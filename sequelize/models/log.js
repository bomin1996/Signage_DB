module.exports = (sequelize, DataTypes) => {
    const Log = sequelize.define('Log', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        level: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        details: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'Logs',
        timestamps: false
    });

    return Log;
};
