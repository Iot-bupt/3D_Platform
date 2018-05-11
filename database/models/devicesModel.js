//const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];
const db = require('../db');

module.exports = db.defineModel('devicesModel', {
    // deviceModelId: {
    //     type:db.STRING(50),
    //     primaryKey: true,
    //     comment: "自增，主键",
    //     validate:{
    //         initialAutoIncrement: 0,
    //         autoIncrement: true,
    //     }
        
    // },
    tenantId: db.ID,
    deviceId: db.STRING(50),
    sceneModelId:db.ID,   //外键
    deviceModelUrl: db.STRING(100),
    compressStatus: {
        type: db.BOOLEAN,
        comment:"compressed or not",
        defaultValue: false
    },
    ossStatus: {
        type: db.BOOLEAN,
        comment:"toOSS or not",
        defaultValue: false
    },
    locationInfo: {
        type:db.STRING(100),//存设备模型坐标信息，xyz
        allowNull:true
    },    
    label: {
        type:db.TEXT,
        allowNull: true
    }
});