// store products as database:
//在这里操作数据库拿数据
//对一张表的所有操作都写在这一个js中

const model = require('../database/model');

let Site = model.Site;


function Sites(name,tenantId,longtitude,latitude) {
    this.name = name;
    this.tenantId = tenantId;
    this.longtitude = longtitude;
    this.latitude = latitude;
}

// var products = [
//     new Product('iPhone 7', 'Apple', 6800),
//     new Product('ThinkPad T440', 'Lenovo', 5999),
//     new Product('LBP2900', 'Canon', 1099)
// ];

module.exports = {
    getSites: async () => {
        var sites = await Site.findAll();              //这里可以调用数据库操作方法
        
       
        return sites;     //async函数return的时候会返回一个promise对象
    },


    getSiteById: async (id) => {
        
        var site = await Site.findAll({
            where:{
                id: id
            }
        });
        
        
        return site;
    },

    getSiteByName: async (name) => {
        
        var site = await Site.findAll({
            where:{
                name: name
            }
        });
        
        
        return site;
    },

    getSiteByTenentId: async (id) => {
        
        var site = await Site.findAll({
            where:{
                tenantId: id
            }
        });
        
        
        return site;
    },


    createSite: async (name, tenantId,longtitude,latitude) => {
        
        var s = new Sites(name,tenantId,longtitude,latitude);
        var site = await Site.create(s);
        
        return site;
    },

    deleteSite: async (id) => {
        
        var site = await Site.destroy({
            where: {
                id:id
            }
        });
           //删除成功返回1，失败返回0

        return site;
    },

    renameSite: async (id,name) => {
        
        var site = await Site.update(
            {
                name:name,
                updatedAt:Date.now(),
            },
            {
                where: {
                id:id
                }
        }
        );     //返回一个一维数组，表示每个更新的失败或成功，0表示失败，1表示成功
        
            //更新成功返回[1]，失败返回[0]
       

        return site;
    },

    // getSites: async () => {
    //     var sites = await Site.findAll({
    //         // 'attributes': ['id', 'name','longtitude','updatedAt']
    //     });              //这里可以调用数据库操作方法
    //     console.log(JSON.stringify(sites));
        
    //     //db.createItem();
       
    //     return sites;     //async函数return的时候会返回一个promise对象
    // },
};
