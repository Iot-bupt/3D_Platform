//require，通过db内置方法构建数据模型

const db = require('../db');

module.exports = db.defineModel('scenes', {
    
    // sceneId: {
    //         type:db.STRING(50),
    //         primaryKey: true,
    //         comment: "主键，自增",
    //         // validate:{
    //         //     initialAutoIncrement: 0,
    //         //     autoIncrement: true
    //         // }
    // },
    tenantId: db.ID,    //即租户ID
    name: db.STRING(50),
    sceneUrl: db.STRING(100),
    compressStatus:{
        type: db.BOOLEAN,
        comment:"compressed or not",
        defaultValue: false
    },
    ossStatus: {
        type: db.BOOLEAN,
        comment:"toOSS or not",
        defaultValue: false
    },
    devicesModelCount: {
        type: db.INTEGER,
        defaultValue: 0
    }
});

//以上三个是我自己定义的属性，id,createdAt,updatedAt,version是由model定义时自动添加的属性
