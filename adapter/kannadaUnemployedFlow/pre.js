var api = require('../../system/api.js');
var helper = require('../../system/helper.js');
var dbManager = require('../../dbManager/connect.js');
var msg = require('../../lang.json');


module.exports = {
    email: function (data) {
        console.log("email pre stage")
        return new Promise(function (resolve, reject) {
            if (data && data.tags && !data.tags.emailStage) {
                data.reply = {
                    type: 'text',
                    text: msg.kannada.unemployed.emailId.valid
                }
            }
            else {
                console.log("----printing this-----")
                data.reply = {
                    type: 'text',
                    text: msg.kannada.unemployed.emailId.fallback
                }
            }
            return resolve(data)
        })
    },
    mobileNo : function (data) {
        console.log("mobile no pre stage")
        return new Promise(function (resolve, reject) {
            if (data && data.tags && !data.tags.mobileStage) {
                data.reply = {
                    type: 'text',
                    text: msg.kannada.unemployed.mobileNo.valid,
                }
            }
            else {
                console.log("----printing this-----")
                data.reply = {
                    type: 'text',
                    text: msg.kannada.unemployed.mobileNo.fallback,
                }
            }
            return resolve(data)
        })
    },
    end : function (data) {
        console.log("end pre stage")
        return new Promise(function (resolve, reject) {
            data.reply = {
                type: 'text',
                text: msg.kannada.unemployed.end.valid,
            }
            return resolve(data)
        })
    }
}
