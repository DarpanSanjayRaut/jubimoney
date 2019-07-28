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
                    text: msg.kannada.getStarted.start.valid,
                    next: {
                        data: [
                            {
                                data: msg.kannada.getStarted.start.button[0].data,
                                text: msg.kannada.getStarted.start.button[0].text
                            }
                        ]
                    }
                }
                data.tags.lang = 4
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
    // info: function (data) {
    //     console.log('-----------info getstarted pre-------------------')
    //     return new Promise(function (resolve, reject) {
    //         try {
    //             data.reply = {
    //                 type: 'quickReply',
    //                 text: 'It’s important for you to understand money to create a comfortable and fulfilling life for yourself and your loved ones.|break| But, the financial world with its complicated & technical terms can be a mystery. |break| With JubiMoney, my goal is to simplify it for you. |break| My creators have trained me to share with you only the advice they would share with their parents or siblings. |br|And, I promise to guard your data with all my life!💂',
    //                 next: {
    //                     data: [
    //                         {
    //                             data: 'lets do this',
    //                             text: 'Let’s do this!'
    //                         },
    //                         {
    //                             data: 'How does this work?',
    //                             text: 'How does this work'
    //                         }
    //                     ]
    //                 }
    //             }
    //             return resolve(data)
    //         }
    //         catch (e) {
    //             console.log(e)
    //             return reject(e)
    //         }
    //     })
    // }
}


