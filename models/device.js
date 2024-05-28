module.exports = (sequelize, DataTypes) => {
    const Device = sequelize.define('Device', {
        device_id: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },
        group_name: {
            type: DataTypes.STRING(100),
            references: {
                model: 'Groups',
                key: 'group_name'
            }
        },
        status: DataTypes.STRING(20),
        os: DataTypes.STRING(100),
        device_name: DataTypes.STRING(100),
        ip_address: DataTypes.STRING(15),
        control_board_wifi_status: DataTypes.BOOLEAN,
        control_board_camera_status: DataTypes.BOOLEAN,
        control_board_auto_door_status: DataTypes.BOOLEAN,
        control_board_media_screen_status: DataTypes.BOOLEAN,
        control_board_aircon_status: DataTypes.BOOLEAN,
        nvr_url: DataTypes.STRING(255),
        bt_ip: DataTypes.STRING(15),
        loc_x: DataTypes.FLOAT,
        loc_y: DataTypes.FLOAT
    }, {
        tableName: 'Devices',
        timestamps: false
    });

    return Device;
};
