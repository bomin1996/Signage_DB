module.exports = (sequelize, DataTypes) => {
    const Content = sequelize.define('Content', {
        content_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        file_name: DataTypes.STRING(100),
        saved_file_name: DataTypes.STRING(100), // 실제 저장된 파일 이름
        file_type: DataTypes.STRING(20),
        file_size: DataTypes.FLOAT,
        file_path: DataTypes.STRING(255),
        upload_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'Contents',
        timestamps: false
    });

    return Content;
};
