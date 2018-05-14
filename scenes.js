// store products as database:
//在这里操作数据库拿数据
//对一张表的所有操作都写在这一个js中

const db = require('./handleDB');

const model = require('./database/model');

let Scene = model.Scene;


function Scenes(name,tenantId) {
    this.name = name;
    this.tenantId = tenantId;
}

// var products = [
//     new Product('iPhone 7', 'Apple', 6800),
//     new Product('ThinkPad T440', 'Lenovo', 5999),
//     new Product('LBP2900', 'Canon', 1099)
// ];

module.exports = {
    getScenes: async () => {
        var scenes = await Scene.findAll();              //这里可以调用数据库操作方法
        console.log(JSON.stringify(scenes));
        
        //db.createItem();
       
        return scenes;     //async函数return的时候会返回一个promise对象
    },


    getSceneById: async (id) => {
        
        var scene = await Scene.findAll({
            where:{
                id: id
            }
        });
        console.log(JSON.stringify(scene));
        
        return scene;
    },

    getSceneByTenentId: async (id) => {
        
        var scene = await Scene.findAll({
            where:{
                tenantId: id
            }
        });
        console.log(JSON.stringify(scene));
        
        return scene;
    },

    getSceneByName: async (name) => {
        
        var scene = await Scene.findAll({
            where:{
                name: name
            }
        });
        console.log(JSON.stringify(scene));
        
        return scene;
    },

    createScene: async (name, tenantId) => {
        
        var s = new Scenes(name,tenantId);
        var scene = await Scene.create(s);
        
        return scene;
    },

    deleteScene: (id) => {
        var
            index = -1,
            i;
        for (i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            // remove products[index]:
            return products.splice(index, 1)[0];
        }
        return null;
    }
};
