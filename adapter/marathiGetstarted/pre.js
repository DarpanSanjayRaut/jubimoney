var api = require('../../system/api.js');
var helper = require('../../system/helper.js');
var msg = require('../../lang.json');

module.exports = {
    start: function (data) {
        console.log('-----------start getstarted pre-------------------')
        return new Promise(function (resolve, reject) {
            try {
                data.reply = {
                    type: 'quickReply',
                    text: msg.marathi.getStarted.start.valid,
                    next: {
                        data: [
                            {
                                data: msg.marathi.getStarted.start.button[0].data,
                                text: msg.marathi.getStarted.start.button[0].text
                            }
                        ]
                    }
                }
                data.tags.lang = 3
                console.log('-----------------data resolved from pre-------------------')
                console.log(data.tags)
                return resolve(data)
            }
            catch (e) {
                console.log(e)
                return reject(e)
            }
        })
    }
}


