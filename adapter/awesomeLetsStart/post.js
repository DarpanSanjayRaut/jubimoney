var api = require('../../system/api.js');
var helper = require('../../system/helper.js');

module.exports = {
    letsStart: function (data) {
        console.log('came in post over here-----------')
        return new Promise(async (resolve, reject) => {
            try {
                if (data && !data.data) {
                    return reject(data)
                }
                if (data.data.toLowerCase() == 'i avoid money-matters' || data.data.toLowerCase() == 'money stresses me') {
                    data.tags.points = 1
                    data.tags.moneyRelation = data.data.toLowerCase()
                    console.log(data.tags)
                    delete data.stage
                    return resolve(data)
                }
                else if (data.data.toLowerCase() == 'its good') {
                    data.tags.points = 3
                    data.tags.moneyRelation = data.data.toLowerCase()
                    console.log(data.tags)
                    delete data.stage
                    return resolve(data)
                }
                else if (data.data.toLowerCase() == 'i want to do better') {
                    data.tags.points = 2
                    data.tags.moneyRelation = data.data.toLowerCase()
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
    name: function (data) {
        console.log('----------------name post stage-----------------')
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.nameStage = true
                if (data && !data.data) {
                    return reject(data)
                }
                if (data.data.match(/[\u0900-\u097F]+/)) {
                    console.log('------------in success case--------')
                    data.tags.name = data.data
                    delete data.tags.nameStage
                    delete data.stage
                    console.log(data)
                    return resolve(data)
                }
                else if (data.data.match(/[[a-z,A-Z]+/)) {
                    let name = await api.name(data.data)
                    console.log(name)
                    if (name.status == "success") {
                        if (name.name.match(/[A-Za-z]/)) {
                            console.log('------------in success case--------')
                            data.tags.name = toTitleCase(name.name)
                            delete data.tags.nameStage
                            delete data.stage
                            console.log(data)
                            return resolve(data)
                        }
                        else {
                            return resolve(data)
                        }
                    }
                    else {
                        console.log('-------rejected------------')
                        return resolve(data)
                    }
                }
                return resolve(data)
            }
            catch (e) {
                console.log(e)
                return reject(e)
            }
        })
    },
    nameCheck: function (data) {
        console.log('Checking name-------------------')
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.nameCheckStage = true
                if (data && !data.data) {
                    return reject(data)
                }
                if (data.data.toLowerCase() == 'edit') {
                    delete data.tags.nameCheckStage
                    data.stage = 'name'
                    return resolve(data)
                }
                else if (data.data.toLowerCase() == 'correct') {
                    delete data.tags.nameCheckStage
                    data.stage = 'age'
                    return resolve(data)
                }
                return resolve(data)
            }
            catch (e) {
                console.log(e)
                return reject(e)
            }
        })
    },
    age : function (data) {
        console.log('------age stage-------------123456---')
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.dobStage = true
                if (data && !data.data) {
                    return reject(data)
                }
                if (data.data.match(/[०-९]/)){
                    engNo = helper.numHindiToeng(data.data)
                    if (engNo.toLowerCase() == 'not' || engNo.toLowerCase() == 'didnt work' ){
                        return resolve (data)
                    }
                    data.data = engNo
                }
                if (data.data.match(/\d+/)){
                    var age = data.data.match(/\d+/)[0]
                    if (parseInt(age) >= 1 && parseInt(age) <= 100){
                        data.tags.age = age
                        delete data.tags.dobStage
                        console.log("---------------------User Dob--------------------")
                        console.log(data.tags)
                        delete data.stage
                        return resolve(data)
                    }
                    else {
                        return resolve(data)
                    }
                }
                return resolve(data)
            }
            catch (e) {
                console.log(e)
                return reject(e)
            }
        })
    },
    gender: function (data) {
        console.log('------gender stage----------------')
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.genderStage = true
                if (data && !data.data) {
                    return reject(data)
                }
                if (data.data.toLowerCase() == 'female' || data.data.toLowerCase() == 'male' || data.data.toLowerCase() == 'other') {
                    data.tags.gender = data.data.toLowerCase()
                    delete data.tags.genderStage
                    console.log("---------------------User geder--------------------")
                    console.log(data.tags)
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
    },
    relationship: function (data) {
        console.log('------relationship stage----------------')
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.relationshipStage = true
                if (data && !data.data) {
                    return reject(data)
                }
                if (data.data.toLowerCase() == 'single' || data.data.toLowerCase() == 'married') {
                    data.tags.relationship = data.data.toLowerCase()
                    delete data.tags.relationshipStage
                    console.log("---------------------User relationship--------------------")
                    console.log(data.tags)
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

function toTitleCase(str) { return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }); }