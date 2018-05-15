//const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];
const db = require('../db');

module.exports = db.defineModel('sites', {
    // tenantId: {
    //     type:db.STRING(50),
    //     primaryKey: true,
    //     comment: "自增，主键",
    //     validate:{
    //         initialAutoIncrement: 0,
    //         autoIncrement: true,
    //     }
        
    // },
    tenantId: db.INTEGER,
    name: {
        type:db.STRING(50)
    },
    longtitude: {
        type:db.DOUBLE,
        defaultValue:0
    },
    latitude: {
        type:db.DOUBLE,
        defaultValue:0
    },
    sceneId: {
        type:db.INTEGER,
        allowNull : true
    }
});