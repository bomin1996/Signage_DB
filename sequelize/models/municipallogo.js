module.exports = (sequelize, DataTypes) => {
    const MunicipalLogo = sequelize.define('MunicipalLogo', {
        logo_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        file_path: DataTypes.STRING(255),
        position_x: DataTypes.INTEGER,
        position_y: DataTypes.INTEGER,
        width: DataTypes.INTEGER,
        height: DataTypes.INTEGER
    }, {
        tableName: 'MunicipalLogos',
        timestamps: false
    });

    return MunicipalLogo;
};
