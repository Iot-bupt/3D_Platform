const upload = require('../services/upload.js');

const APIError = require('../rest').APIError;

module.exports = {

    'POST /api/uploadScene': async (ctx, next) => {

        var files = ctx.request.files;
        var res = await upload.uploadScene(files);
        if (res){
            ctx.rest(res);   
                
        }else{
            throw new APIError('upload:have no files', 'have no file accepted');
        }
        
        },

};