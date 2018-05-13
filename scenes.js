// store products as database:
//在这里操作数据库拿数据
//对一张表的所有操作都写在这一个js中

const db = require('./handleDB');

const model = require('./database/model');

let Scene = model.Scene;
// var id = 0;

// function nextId() {
//     id++;
//     return 'p' + id;
// }

// function Product(name, manufacturer, price) {
//     this.id = nextId();
//     this.name = name;
//     this.manufacturer = manufacturer;
//     this.price = price;
// }

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



    getProduct: (id) => {
        var i;
        for (i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                return products[i];
            }
        }
        return null;
    },

    createProduct: (name, manufacturer, price) => {
        var p = new Product(name, manufacturer, price);
        products.push(p);
        return p;
    },

    deleteProduct: (id) => {
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
