const model = require('./database/model');



let
    // Pet = model.Pet,
    // User = model.User,
    Scene = model.Scene;
    

module.exports = {

    createItem: async () => {
        
            // var user = await User.create({
            //     name: 'John',
            //     gender: false,
            //     email: 'john-' + Date.now() + '@garfield.pet',
            //     passwd: 'hahaha'
            // });
            // console.log('created: ' + JSON.stringify(user));
            // var cat = await Pet.create({
            //     ownerId: user.id,
            //     name: 'Garfield',
            //     gender: false,
            //     birth: '2007-07-07',
            // });
            
            
            var scene1 = await Scene.create({
                tenantId: '007',
                name: 'test',
                sceneUrl:'123',
                
            });
            console.log('created: ' + JSON.stringify(scene1));
                   

}
}