module.exports = (sequelize, DataTypes) => {
    const LayoutApplication = sequelize.define('LayoutApplication', {
        application_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        layout_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Layouts',
                key: 'layout_id'
            }
        },
        group_name: DataTypes.STRING(100),
        device_id: {
            type: DataTypes.STRING(50),
            references: {
                model: 'Devices',
                key: 'device_id'
            }
        },
        application_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'LayoutApplications',
        timestamps: false
    });

    return LayoutApplication;
};
