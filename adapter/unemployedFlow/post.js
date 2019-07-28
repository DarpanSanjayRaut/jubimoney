var api = require('../../system/api.js');
var helper = require('../../system/helper.js');
var dbManager = require('../../dbManager/connect.js')
var msg = require('../../lang.json');



module.exports = {
    emailId: function (data) {
        console.log("phone no stage")
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.emailStage = true
                data.tags.unemployedFlow = true
                if (data && !data.data) {
                    return reject(data)
                }
				var emailId = await helper.extractEmail(data.data)
				if (emailId.toLowerCase() == "invalid"){
					return reject(data)
				}
				else {
                    data.tags.email = emailId
                    delete data.tags.emailStage
					console.log("---------------------------email stage-------------------")
					console.log(data.tags)
					delete data.stage 
					return resolve(data)
				}
            }
            catch (e) {
                console.log(e)
                return reject(e)
            }
        })
    },
    mobileNo: function (data) {
        console.log('--------------mobile no-------')
        return new Promise(async (resolve, reject) => {
            try {
                if (data && !data.data) {
                    return reject("No data found")
                }
                data.tags.mobileStage = true
                if (data.data.match(/[०-९]/)){
                    engNo = helper.numHindiToeng(data.data)
                    if (engNo.toLowerCase() == 'not' || engNo.toLowerCase() == 'didnt work' ){
                        return resolve (data)
                    }
                    data.data = engNo
                }
                let mobNo = await helper.extractMobile(data.data)
                if (mobNo.toLowerCase() == 'invalid') {
                    return reject(data)
                }
                else {
                    data.tags.mobileNo = mobNo
                    delete data.tags.mobileStage
                    delete data.stage
                    return resolve(data)
                }
            }
            catch (e) {
                return reject(e)
            }
        })
    }
}
