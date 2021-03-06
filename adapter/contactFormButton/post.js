var helper = require('../../system/helper.js');
var api = require('../../system/api.js');

module.exports = {
    start: function (data) {
        console.log('came in post over here-----------')
        return new Promise(async (resolve, reject) => {
            try {
                if (data && !data.data) {
                    return reject(data)
                }
                if (data.data.toLowerCase() == 'know more' || data.data.toLowerCase() == 'feedback' || data.data.toLowerCase() == 'advice' || data.data.toLowerCase() == 'chat') {
                    data.tags.userChoice = data.data.toLowerCase()
                    console.log(data.tags)
                    delete data.stage
                    return resolve(data)
                }
                return reject(data)
            }
            catch (e) {
                console.log(e)
                return reject(data)
            }
        })
    },
    msg: function (data) {
        console.log('came in post over here-----------')
        return new Promise(async (resolve, reject) => {
            try {
                if (data && !data.data) {
                    return reject(data)
                }
                data.tags.userMsg = data.data
                console.log(data.tags)
                delete data.stage
                return resolve(data)
            }
            catch (e) {
                console.log(e)
                return reject(data)
            }
        })
    },
    name: function (data) {
        console.log('----------------name post stage-----------------')
        return new Promise(async (resolve, reject) => {
            try {
                if (data && !data.data) {
                    return reject(data)
                } 
                if (data.data.match(/[[a-z,A-Z]+/)) {
                    let name = await api.name(data.data)
                    console.log(name)
                    if (name.status == "success") {
                        if (name.name.match(/[A-Za-z]/)) {
                            console.log('------------in success case--------')
                            data.tags.name = toTitleCase(name.name)
                            delete data.stage
                            console.log(data)
                            return resolve(data)
                        }
                        else {
                            return reject(data)
                        }
                    }
                    else {
                        console.log('-------rejected------------')
                        return reject(data)
                    }
                }
                return reject(data)
            }
            catch (e) {
                console.log(e)
                return reject(e)
            }
        })
    },
    mobileNo: function (data) {
        console.log("phone no stage")
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.phoneStage = true
                if (data && !data.data) {
                    return reject(data)
                }
                if (data.data.toLowerCase() == 'skip') {
                    delete data.stage
                    console.log("---------------------------phone no before report stage-------------------")
                    console.log(data.tags) 
                    return resolve(data)
                }
                else {
                    let mobNo = await helper.extractMobile(data.data)
                    if (mobNo.toLowerCase() == 'invalid') {
                        return reject(data)
                    }
                    else {
                        data.tags.mobileNo = mobNo
                        delete data.stage
                        console.log("---------------------------phone no before report stage-------------------")
                        console.log(data.tags)  
                        return resolve(data)
                    }
                }
            }
            catch (e) {
                console.log(e)
                return reject(e)
            }
        })
    },
    emailId: function (data) {
        console.log("phone no stage")
        return new Promise(async (resolve, reject) => {
            try {
                if (data && !data.data) {
                    return reject(data)
                }
				var emailId = await helper.extractEmail(data.data)
				if (emailId.toLowerCase() == "invalid"){
					return reject(data)
				}
				else {
                    data.tags.email = emailId
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
    }
}
function toTitleCase(str) { return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }); }