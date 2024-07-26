module.exports = (sequelize, DataTypes) => {
    const Layout = sequelize.define('Layout', {
        layout_id: {
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
        layout_name: DataTypes.STRING(100),
        category: DataTypes.STRING(50),
        orientation: DataTypes.STRING(20),
        screen_split: DataTypes.STRING(100),
        direction: DataTypes.STRING(20),
        resolution: DataTypes.STRING(20),
        register_date: DataTypes.DATE,
        update_date: DataTypes.DATE,
        notes: DataTypes.TEXT
    }, {
        tableName: 'Layouts',
        timestamps: false
    });



    return Layout;
};
