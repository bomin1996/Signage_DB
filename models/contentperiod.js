module.exports = (sequelize, DataTypes) => {
    const ContentPeriod = sequelize.define('ContentPeriod', {
        period_id: {
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
        start_date: DataTypes.DATE,
        start_time: DataTypes.TIME,
        end_date: DataTypes.DATE,
        end_time: DataTypes.TIME
    }, {
        tableName: 'ContentPeriods',
        timestamps: false
    });

    return ContentPeriod;
};
