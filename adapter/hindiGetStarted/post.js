var api = require('../../system/api.js');
var helper = require('../../system/helper.js');

module.exports = {
    hindiStart: function (data) {
        console.log('-----------get started start post -------------------')
        return new Promise(async function (resolve, reject) {
            try {
                data.tags.startStage = '1'
                if (data && !data.data) {
                    return reject("No data found")
                }
                if (data.data.toLowerCase() == 'tell me more' || data.data.toLowerCase() == 'great!'){
                    data.tags.start = data.data
                    delete data.tags.startStage
                    delete data.stage
                    return resolve(data)
                }
                return resolve(data)
                
            }
            catch (e) {
                console.log(e)
                return reject(e)
            }
        })
    }
}