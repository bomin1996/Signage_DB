const express = require('express');
const router = express.Router();
const db = require('../sequelize');

// 새로운 디바이스를 등록
router.post('/', async (req, res) => {
    const { device_id, group_name, status, os, device_name, ip_address } = req.body;

    try {
        const device = await db.Devices.create({
            device_id,
            group_name,
            status,
            os,
            device_name,
            ip_address
        });

        res.status(201).json({ message: 'Device created successfully', device });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// 등록된 디바이스의 목록을 조회
router.get('/', async (req, res) => {
    try {
        const devices = await db.Devices.findAll();
        res.status(200).json(devices);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// 디바이스의 상태를 업데이트
router.put('/:deviceId', async (req, res) => {
    const deviceId = req.params.deviceId;
    const { status, os, device_name, ip_address } = req.body;

    try {
        const device = await db.Devices.findByPk(deviceId);

        if (!device) {
            return res.status(404).json({ error: 'Device not found' });
        }

        device.status = status || device.status;
        device.os = os || device.os;
        device.device_name = device_name || device.device_name;
        device.ip_address = ip_address || device.ip_address;

        await device.save();

        res.status(200).json({ message: 'Device updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// 특정 디바이스를 삭제
router.delete('/:deviceId', async (req, res) => {
    const deviceId = req.params.deviceId;

    try {
        const device = await db.Devices.findByPk(deviceId);

        if (!device) {
            return res.status(404).json({ error: 'Device not found' });
        }

        await db.Devices.destroy({ where: { device_id: deviceId } });

        res.status(200).json({ message: 'Device deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

module.exports = router;
