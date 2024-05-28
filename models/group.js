module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define('Group', {
        group_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        group_name: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false
        }
    }, {
        tableName: 'Groups',
        timestamps: false
    });

    return Group;
};
