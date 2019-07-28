var api = require('../../system/api.js');
var helper = require('../../system/helper.js');
var dbManager = require('../../dbManager/connect.js')
var msg = require('../../lang.json');


module.exports = {
    dependentNo: function (data) {
        console.log('--------------------dependentNo stage retired flow----------------')
        return new Promise(async (resolve, reject) => {
            try {
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
                console.log(data.data)
                console.log(parseInt(data.data))
                data.tags.retiredFlow = true
                data.tags.emergencyFund = { current: '0', ideal: '0' }
                data.tags.investment = { exist: 'no', current: '0', ideal: '0' }
                data.tags.termInsurance = { exist: 'no', current: '0', ideal: '0' }
                data.tags.healthInsurance = { exist: 'no', current: '0', ideal: '0' }
                data.tags.borrowing = { current: '0', ideal: '0' }
                data.tags.english = { emergencyFund: 'empty', termInsurance: 'empty', healthInsurance: 'empty', homeloan: 'empty' }
                data.tags.hindi = { emergencyFund: 'empty', termInsurance: 'empty', healthInsurance: 'empty', homeloan: 'empty' }
                data.tags.dependentNoStage = true
                if (data.data == '0' || data.data == '1' || data.data == '2 or more') {
                    data.tags.dependentNo = data.data
                    delete data.tags.dependentNoStage
                    console.log('--------------------------user dependent no-------------')
                    console.log(data.tags)
                    delete data.stage
                    return resolve(data)
                }
                else if (parseInt(data.data) >= 2) {
                    data.tags.dependentNo = data.data
                    delete data.tags.dependentNoStage
                    console.log('--------------------------user dependent no-------------')
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
    pension: function (data) {
        console.log('--------------------salary stage----------------')
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.pensionStage = true
                if (data && !data.data) {
                    return reject("No data found")
                }
                if (data.data.match(/[०-९]/)){
                    engNo = helper.numHindiToeng(data.data)
                    if (engNo.toLowerCase() == 'not' || engNo.toLowerCase() == 'didnt work' ){
                        return resolve (data)
                    }
                    data.data = engNo
                }
                var pension = await helper.extractAmount(data.data)
                if (pension == 'invalid') {
                    console.log('------------salary rejected input invalid---------------------')
                    return resolve(data)
                }
                else {
                    data.tags.pension = pension
                    delete data.stage
                    delete data.tags.pensionStage
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
                if (data.data.match(/[०-९]/)){
                    engNo = helper.numHindiToeng(data.data)
                    if (engNo.toLowerCase() == 'not' || engNo.toLowerCase() == 'didnt work' ){
                        return resolve (data)
                    }
                    data.data = engNo
                }
                var expense = await helper.extractAmount(data.data)
                if (expense == 'invalid') {
                    console.log('------------salary rejected input invalid---------------------')
                    return resolve(data)
                }
                else {
                    data.tags.expense = expense
                    expensePt = await helper.expensePoint(data.tags.pension, data.tags.expense)
                    console.log(expensePt)
                    console.log(typeof expensePt)
                    point = parseInt(data.tags.points) + parseInt(expensePt)
                    data.tags.points = point
                    delete data.stage
                    delete data.tags.expenseStage
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
    emergencyFund: function (data) {
        console.log('------------------energency fund stage--------------------')
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.emergencyFundStage = true
                if (data && !data.data) {
                    return reject("No data found")
                }
                if (data.data.match(/[०-९]/)){
                    engNo = helper.numHindiToeng(data.data)
                    if (engNo.toLowerCase() == 'not' || engNo.toLowerCase() == 'didnt work' ){
                        return resolve (data)
                    }
                    data.data = engNo
                }
                var emergencyAmt = await helper.extractAmount(data.data)
                if (emergencyAmt == 'invalid') {
                    console.log('------------emergency fund rejected input invalid---------------------')
                    return resolve(data)
                }
                else {
                    if (data.tags && !data.tags.emergencyFund) {
                        data.tags.emergencyFund = {}
                    }
                    data.tags.emergencyFund.current = emergencyAmt
                    idealEmergencyFund = parseInt(data.tags.expense) * 6
                    data.tags.emergencyFund.ideal = idealEmergencyFund
                    emergencyPt = await helper.emergencyPoint(data.tags.expense, data.tags.emergencyFund.current)
                    point = parseInt(data.tags.points) + parseInt(emergencyPt)
                    data.tags.points = point
                    if (parseInt(data.tags.emergencyFund.current) >= parseInt(data.tags.emergencyFund.ideal)) {
                        data.tags.english.emergencyFund = msg.english.report.emergencyFund.ideal
                        data.tags.hindi.emergencyFund = msg.hindi.report.emergencyFund.notIdeal
                    }
                    else {
                        //might change this
                        data.tags.english.emergencyFund = msg.english.report.emergencyFund.ideal
                        data.tags.hindi.emergencyFund = msg.hindi.report.emergencyFund.notIdeal
                    }
                    delete data.tags.emergencyFundStage
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
    monthlyInvestment: function (data) {
        console.log('------------------monthly investment stage--------------------')
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.monthlyInvestmentStage = true
                if (data && !data.data) {
                    return reject("No data found")
                }
                if (data.data.match(/[०-९]/)){
                    engNo = helper.numHindiToeng(data.data)
                    if (engNo.toLowerCase() == 'not' || engNo.toLowerCase() == 'didnt work' ){
                        return resolve (data)
                    }
                    data.data = engNo
                }
                if (data.data.toLowerCase() == 'skip') {
                    data.tags.investment.exist = 'Yes'
                    data.tags.investment.current = '0'
                    idealInvestment = 0.2 * parseFloat(data.tags.pension)
                    data.tags.investment.ideal = idealInvestment
                    investPt = await helper.investPoint(data.tags.pension, data.tags.investment.current)
                    point = parseInt(data.tags.points) + parseInt(investPt)
                    data.tags.points = point
                    data.tags.english.investment = msg.english.report.Investment.notIdeal
                    data.tags.hindi.investment = msg.hindi.report.Investment.notIdeal
                    delete data.tags.monthlyInvestmentStage
                    delete data.stage
                    return resolve(data)
                }
                else if (data.data == '0') {
                    data.tags.investment.exist = 'No'
                    data.tags.investment.current = '0'
                    idealInvestment = 0.2 * parseFloat(data.tags.pension) 
                    data.tags.investment.ideal = idealInvestment
                    investPt = await helper.investPoint(data.tags.pension, data.tags.investment.current)
                    point = parseInt(data.tags.points) + parseInt(investPt)
                    data.tags.points = point
                    data.tags.english.investment = msg.english.report.Investment.notIdeal
                    data.tags.hindi.investment = msg.hindi.report.Investment.notIdeal
                    delete data.tags.monthlyInvestmentStage
                    delete data.stage
                    return resolve(data)
                }
                else {
                    var investAmt = await helper.extractAmount(data.data)
                    if (investAmt == 'invalid') {
                        console.log('------------emergency fund rejected input invalid---------------------')
                        return resolve(data)
                    }
                    else {
                        data.tags.investment.exist = 'Yes'
                        currentInvestment = parseInt(investAmt) 
                        data.tags.investment.current = currentInvestment
                        idealInvestment = 0.2 * parseFloat(data.tags.pension) 
                        data.tags.investment.ideal = idealInvestment
                        investPt = await helper.investPoint(data.tags.pension, data.tags.investment.current)
                        point = parseInt(data.tags.points) + parseInt(investPt)
                        data.tags.points = point
                        data.tags.english.investment = {}
                        data.tags.hindi.investment = {}
                        if (parseInt(data.tags.investment.current) < parseInt(data.tags.investment.ideal)){
                            data.tags.english.investment = msg.english.report.Investment.notIdeal
                            data.tags.hindi.investment = msg.hindi.report.Investment.notIdeal
                        }
                        else {
                            data.tags.english.investment = msg.english.report.Investment.ideal
                            data.tags.hindi.investment = msg.hindi.report.Investment.ideal
                        }
                        delete data.tags.monthlyInvestmentStage
                        delete data.stage
                        console.log('--------------------------')
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
    lifeInsurance: function (data) {
        console.log('------------------insurance stage--------------------')
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.lifeInsuranceStage = true
                if (data && !data.data) {
                    return reject("No data found")
                }
                if (data.data.toLowerCase() == 'yes') {
                    data.tags.termInsurance.exist = data.data.toLowerCase()
                    delete data.tags.lifeInsuranceStage
                    delete data.stage
                    console.log(data.tags)
                    return resolve(data)
                }
                else if (data.data.toLowerCase() == 'no') {
                    data.tags.termInsurance.exist = data.data.toLowerCase()
                    data.tags.termInsurance.current = '0'
                    delete data.tags.lifeInsuranceStage
                    data.stage = 'healthInsurance'
                    console.log(data.tags)
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
    lifeInsuranceAmt: function (data) {
        console.log('------------------life insurance amount stage--------------------')
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.lifeInsuranceAmtStage = true
                if (data && !data.data) {
                    return reject("No data found")
                }
                if (data.data.match(/[०-९]/)){
                    engNo = helper.numHindiToeng(data.data)
                    if (engNo.toLowerCase() == 'not' || engNo.toLowerCase() == 'didnt work' ){
                        return resolve (data)
                    }
                    data.data = engNo
                }
                if (data.data.toLowerCase() == 'skip') {
                    data.tags.termInsurance.current = '0'
                    delete data.tags.lifeInsuranceAmtStage
                    delete data.stage
                    console.log(data.tags)
                    return resolve(data)
                }
                else {
                    var termInsuranceAmt = await helper.extractAmount(data.data)
                    if (termInsuranceAmt == 'invalid') {
                        console.log('------------emergency fund rejected input invalid---------------------')
                        return resolve(data)
                    }
                    else {
                        data.tags.termInsurance.current = termInsuranceAmt
                        delete data.tags.lifeInsuranceAmtStage
                        delete data.stage
                        console.log('--------------------------')
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
    healthInsurance: function (data) {
        console.log('------------------health insurance stage--------------------')
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.healthInsuranceStage = true
                if (data && !data.data) {
                    return reject("No data found")
                }
                if (data.data.toLowerCase() == 'yes') {
                    data.tags.healthInsurance.exist = data.data.toLowerCase()
                    delete data.tags.healthInsuranceStage
                    delete data.stage
                    console.log(data.tags)
                    return resolve(data)
                }
                else if (data.data.toLowerCase() == 'no') {
                    data.tags.healthInsurance.exist = data.data.toLowerCase()
                    data.tags.healthInsurance.current = '0'
                    delete data.tags.healthInsuranceStage
                    data.stage = 'homeLoan'
                    console.log(data.tags)
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
    healthInsuranceAmt: function (data) {
        console.log('------------------health insurance amt  stage--------------------')
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.healthInsuranceAmtStage = true
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
                if (data.data.toLowerCase() == 'skip') {
                    data.tags.healthInsurance.current = '0'
                    delete data.tags.healthInsuranceAmtStage
                    delete data.stage
                    console.log(data.tags)
                    return resolve(data)
                }
                else {
                    var healthInsuranceAmt = await helper.extractAmount(data.data)
                    if (healthInsuranceAmt == 'invalid') {
                        console.log('----------- health insurance rejected input invalid---------------------')
                        return resolve(data)
                    }
                    else {
                        data.tags.healthInsurance.current = healthInsuranceAmt
                        delete data.tags.healthInsuranceAmtStage
                        delete data.stage
                        console.log('--------------------------')
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
    homeLoan: function (data) {
        console.log('------------------home loan stage--------------------')
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.homeLoanStage = true
                if (data && !data.data) {
                    return reject("No data found")
                }
                if (data.data.toLowerCase() == 'yes') {
                    data.tags.homeLoan = true
                    insurancePt = await helper.insurancePoint(data.tags.termInsurance.exist, data.tags.healthInsurance.exist)
                    point = parseInt(data.tags.points) + parseInt(insurancePt)
                    data.tags.points = point
                    delete data.tags.homeLoanStage
                    delete data.stage
                    console.log(data.tags)
                    return resolve(data)
                }
                else if (data.data.toLowerCase() == 'no') {
                    data.tags.homeLoan = false
                    insurancePt = await helper.insurancePoint(data.tags.termInsurance.exist, data.tags.healthInsurance.exist)
                    point = parseInt(data.tags.points) + parseInt(insurancePt)
                    data.tags.points = point
                    delete data.tags.homeLoanStage
                    delete data.stage
                    console.log(data.tags)
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
    otherLoan: function (data) {
        console.log('------------------home loan stage--------------------')
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.otherLoanStage = true
                if (data && !data.data) {
                    return reject("No data found")
                }
                if (data.data.toLowerCase() == 'yes') {
                    data.tags.otherLoan = true
                    delete data.tags.otherLoanStage
                    delete data.stage
                    console.log(data.tags)
                    return resolve(data)
                }
                else if (data.data.toLowerCase() == 'no') {
                    data.tags.otherLoan = false
                    if (data.tags.homeLoan) {
                        delete data.tags.otherLoanStage
                        delete data.stage
                        console.log(data.tags)
                        return resolve(data)
                    }
                    console.log(data.tags)
                    delete data.tags.otherLoanStage
                    data.stage = 'email'
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
    emi: function (data) {
        console.log('--------------------emi stage----------------')
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.emiStage = true
                if (data && !data.data) {
                    return reject("No data found")
                }
                if (data.data.match(/[०-९]/)){
                    engNo = helper.numHindiToeng(data.data)
                    if (engNo.toLowerCase() == 'not' || engNo.toLowerCase() == 'didnt work' ){
                        return resolve (data)
                    }
                    data.data = engNo
                }
                var emi = await helper.extractAmount(data.data)
                if (emi == 'invalid') {
                    console.log('------------pension rejected input invalid---------------------')
                    return resolve(data)
                }
                else {
                    data.tags.emi = emi
                    emiPt = await helper.emiPoint(data.tags.pension, data.tags.emi)
                    point = parseInt(data.tags.points) + parseInt(emiPt)
                    data.tags.points = point
                    delete data.tags.emiStage
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
    email: function (data) {
        console.log("phone no stage")
        return new Promise(async (resolve, reject) => {
            try {
                data.tags.emailStage = true
                if (data && !data.data) {
                    return reject(data)
                }
				var email = await helper.extractEmail(data.data)
				if (email.toLowerCase() == "invalid"){
					return reject(data)
				}
				else {
                    data.tags.email = email
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
    // report: function (data) {
    //     console.log('---------------report post stage----------')
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             if (data && !data.data) {
    //                 return reject(data)
    //             }
    //             data.tags.question = data.data
    //             if (data.tags.mobileNo){
    //                 data.stage = 'end'
    //                 return resolve(data)
    //             }
    //             else {
    //                 delete data.stage
    //                 return resolve(data)
    //             }
    //         }
    //         catch (e) {
    //             console.log(e)
    //             return reject(e)
    //         }
    //     })
    // },
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

// function getDateInFormat (){
//     var today = new Date();
//     var dd = String(today.getDate()).padStart(2, '0');
//     var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
//     var yyyy = today.getFullYear();

//     today = mm + '/' + dd + '/' + yyyy;
//     return (today)
// }
