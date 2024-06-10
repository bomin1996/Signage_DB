module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define('Schedule', {
        schedule_id: {
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
        start_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'Schedules',
        timestamps: false
    });

    return Schedule;
};
