var helper = require('../../system/helper.js');

module.exports = {
    start: function (data) {
        console.log('-----------get started start post -------------------')
        return new Promise(async function (resolve, reject) {
            try {
                if (data && !data.data) {
                    return reject("No data found")
                }
                if (data.data.toLowerCase() == 'am i saving enough?'){
                    data.tags.start = data.data
                    delete data.stage
                    // console.log('---------------get started re')
                    return resolve(data)
                }
                return reject(data)
                
            }
            catch (e) {
                console.log(e)
                return reject(e)
            }
        })
    },
    salary: function (data) {
        console.log('-----------get started start post -------------------')
        return new Promise(async function (resolve, reject) {
            try {
                if (data && !data.data) {
                    return reject("No data found")
                }
                var salary = await helper.extractAmount(data.data)
                if (salary == 'invalid') {
                    console.log('------------salary rejected input invalid---------------------')
                    return reject(data)
                }
                else {
                    data.tags.salary = salary
                    delete data.stage
                    console.log('--------------------------')
                    console.log(data.tags)
                    return resolve(data)
                }
            }
            catch (e) {
                console.log(e)
                return reject(e)
            }
        })
    },
    expense: function (data) {
        console.log('--------------------expense stage------------------------')
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.expenseStage = true
                if (data && !data.data) {
                    return reject("No data found")
                }
                var expense = await helper.extractAmount(data.data)
                if (expense == 'invalid') {
                    console.log('------------salary rejected input invalid---------------------')
                    return reject(data)
                }
                else {
                    data.tags.expense = expense
                    expensePercent = helper.percentCal(parseInt(data.tags.salary), parseInt(data.tags.expense))
                    if(expensePercent <= 80){
                        data.tags.expensePt = '1'
                    }
                    else{
                        data.tags.expensePt = '0'
                    }
                    delete data.stage
                    console.log('--------------------------')
                    console.log(data.tags)
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