module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        group_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Groups',
                key: 'group_id'
            }
        },
        user_type: DataTypes.STRING(50),
        name: DataTypes.STRING(100),
        username: DataTypes.STRING(50),
        password: DataTypes.STRING(255),
        contact: DataTypes.STRING(20)
    }, {
        tableName: 'Users',
        timestamps: false
    });

    return User;
};
