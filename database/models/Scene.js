//require，通过db内置方法构建数据模型

const db = require('../db');

module.exports = db.defineModel('scenes', {
    ownerId: db.ID,
    sceneId:db.STRING(50),
    name: db.STRING(100),
    
});

//以上三个是我自己定义的属性，id,createdAt,updatedAt,version是由model定义时自动添加的属性
