var api = require('../../system/api.js');
var helper = require('../../system/helper.js');
var msg = require('../../lang.json');


module.exports = {
    hindiStart: function (data) {
        console.log('-----------start getstarted pre-------------------')
        return new Promise(function (resolve, reject) {
            try {
                data.reply = {
                    type: 'quickReply',
                    text: msg.hindi.getStarted.start.valid,
                    next: {
                        data: [
                            {
                                data: msg.hindi.getStarted.start.button[0].data,
                                text: msg.hindi.getStarted.start.button[0].text
                            }
                        ]
                    }
                }
                data.tags.lang = 2
                console.log(data.tags)
                return resolve(data)
            }
            catch (e) {
                console.log(e)
                return reject(e)
            }
        })
    }
    // hindiInfo: function (data) {
    //     console.log('-----------info getstarted pre-------------------')
    //     return new Promise(function (resolve, reject) {
    //         try {
    //             data.reply = {
    //                 type: 'quickReply',
    //                 text: 'मैं आपके व्यक्तित्व और अभी की आर्थिक (फ़ाइनेंशियल) स्थिति को समझूंगा और एक व्यक्तिगत फाइनेंशियल प्लान के साथ आपकी मदद करूंगा|break| हाँ! यह मुफ़्त है, निष्पक्ष है, और आपको टैक्स की बेहतर योजना बनाने में मदद भी करेगा! इसमें और क्या फायदे हैं? |break| आप यह भी देख सकते हैं कि आप दूसरों की तुलना में कैसा कर रहे हैं। |break| तैयार हैं?',
    //                 next: {
    //                     data: [
    //                         {
    //                             data: 'hindi lets do this',
    //                             text: 'चलिए शुरू करते हैं!'
    //                         },
    //                         {
    //                             data: 'more info',
    //                             text: 'मुझे और जानकारी दें'
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


