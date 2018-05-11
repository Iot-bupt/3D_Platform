const model = require('./database/model');

let
    Pet = model.Pet,
    User = model.User,
    Scene = model.Scene;
    

module.exports = {

    createItem: async () => {
        
            var user = await User.create({
                name: 'John',
                gender: false,
                email: 'john-' + Date.now() + '@garfield.pet',
                passwd: 'hahaha'
            });
            console.log('created: ' + JSON.stringify(user));
            var cat = await Pet.create({
                ownerId: user.id,
                name: 'Garfield',
                gender: false,
                birth: '2007-07-07',
            });
            console.log('created: ' + JSON.stringify(cat));
            var dog = await Pet.create({
                ownerId: user.id,
                name: 'Odie',
                gender: false,
                birth: '2008-08-08',
            });
            console.log('created: ' + JSON.stringify(dog));

            var scene1 = await Scene.create({
                ownerId: user.id,
                name: 'test',
                sceneId: user.id
                
            });
            console.log('created: ' + JSON.stringify(dog));
            
            

}

}