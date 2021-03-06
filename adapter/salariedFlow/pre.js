var api = require('../../system/api.js');
var helper = require('../../system/helper.js');
var dbManager = require('../../dbManager/connect.js');
var msg = require('../../lang.json');


module.exports = {
    dependentNo: function (data) {
        console.log('-----------dependent No pre-------------------')
        return new Promise(function (resolve, reject) {
            try {
                if (data && data.tags && !data.tags.dependentNoStage) {
                    data.reply = {
                        type: 'quickReply',
                        text: msg.english.salaried.dependentNo.valid,
                        next: {
                            data: [
                                {
                                    data: msg.english.salaried.dependentNo.button[0].data,
                                    text: msg.english.salaried.dependentNo.button[0].text
                                },
                                {
                                    data: msg.english.salaried.dependentNo.button[1].data,
                                    text: msg.english.salaried.dependentNo.button[1].text
                                },
                                {
                                    data: msg.english.salaried.dependentNo.button[2].data,
                                    text: msg.english.salaried.dependentNo.button[2].text
                                }
                            ]
                        }
                    }
                }
                else {
                    data.reply = {
                        type: 'quickReply',
                        text: msg.english.salaried.dependentNo.fallback,
                        next: {
                            data: [
                                {
                                    data: msg.english.salaried.dependentNo.button[0].data,
                                    text: msg.english.salaried.dependentNo.button[0].text
                                },
                                {
                                    data: msg.english.salaried.dependentNo.button[1].data,
                                    text: msg.english.salaried.dependentNo.button[1].text
                                },
                                {
                                    data: msg.english.salaried.dependentNo.button[2].data,
                                    text: msg.english.salaried.dependentNo.button[2].text
                                }
                            ]
                        }
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
    salary: function (data) {
        return new Promise(function (resolve, reject) {
            if (data && data.tags && !data.tags.salaryStage) {
                data.reply = {
                    type: 'text',
                    text: msg.english.salaried.salary.valid,
                }
            }
            else {
                data.reply = {
                    type: 'text',
                    text: msg.english.salaried.salary.fallback,
                }
            }

            return resolve(data)
        })
    },
    expense: function (data) {
        return new Promise(function (resolve, reject) {
            if (data && data.tags && !data.tags.expenseStage) {
                data.reply = {
                    type: 'text',
                    text: msg.english.salaried.expense.valid,
                }
            }
            else {
                data.reply = {
                    type: 'text',
                    text: msg.english.salaried.expense.fallback,
                }
            }
            return resolve(data)
        })
    },
    emergencyFund: function (data) {
        return new Promise(function (resolve, reject) {
            if (data && data.tags && !data.tags.emergencyFundStage) {
                data.reply = {
                    type: 'text',
                    text: msg.english.salaried.emergencyFund.valid,
                }
            }
            else {
                data.reply = {
                    type: 'text',
                    text: msg.english.salaried.emergencyFund.fallback,
                }
            }
            return resolve(data)
        })
    },
    monthlyInvestment: function (data) {
        console.log('-----------monthly investment pre-------------------')
        return new Promise(function (resolve, reject) {
            try {
                if (data && data.tags && !data.tags.monthlyInvestmentStage) {
                    data.reply = {
                        type: 'text',
                        text: msg.english.salaried.monthlyInvestment.valid
                    }
                }
                else {
                    data.reply = {
                        type: 'text',
                        text: msg.english.salaried.monthlyInvestment.fallback
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
    lifeInsurance: function (data) {
        console.log('-----------life insurance pre-------------------')
        return new Promise(function (resolve, reject) {
            try {
                if (data && data.tags && !data.tags.lifeInsuranceStage) {
                    data.reply = {
                        type: 'quickReply',
                        text: msg.english.salaried.lifeInsurance.valid,
                        next: {
                            data: [
                                {
                                    data: msg.english.salaried.lifeInsurance.button[0].data,
                                    text: msg.english.salaried.lifeInsurance.button[0].text
                                },
                                {
                                    data: msg.english.salaried.lifeInsurance.button[1].data,
                                    text: msg.english.salaried.lifeInsurance.button[1].text
                                }
                            ]
                        }
                    }
                }
                else {
                    data.reply = {
                        type: 'quickReply',
                        text: msg.english.salaried.lifeInsurance.fallback,
                        next: {
                            data: [
                                {
                                    data: msg.english.salaried.lifeInsurance.button[0].data,
                                    text: msg.english.salaried.lifeInsurance.button[0].text
                                },
                                {
                                    data: msg.english.salaried.lifeInsurance.button[1].data,
                                    text: msg.english.salaried.lifeInsurance.button[1].text
                                }
                            ]
                        }
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
    lifeInsuranceAmt: function (data) {
        console.log('-----------life insurance amount pre-------------------')
        return new Promise(function (resolve, reject) {
            try {
                if (data && data.tags && !data.tags.lifeInsuranceAmtStage) {
                    data.reply = {
                        type: 'text',
                        text: msg.english.salaried.lifeInsuranceAmt.valid
                    }
                }
                else {
                    data.reply = {
                        type: 'text',
                        text: msg.english.salaried.lifeInsuranceAmt.fallback
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
    healthInsurance: function (data) {
        console.log('-----------health insurance pre-------------------')
        return new Promise(function (resolve, reject) {
            try {
                if (data && data.tags && !data.tags.healthInsuranceStage) {
                    data.reply = {
                        type: 'quickReply',
                        text: msg.english.salaried.healthInsurance.valid,
                        next: {
                            data: [
                                {
                                    data: msg.english.salaried.healthInsurance.button[0].data,
                                    text: msg.english.salaried.healthInsurance.button[0].text
                                },
                                {
                                    data: msg.english.salaried.healthInsurance.button[1].data,
                                    text: msg.english.salaried.healthInsurance.button[1].text
                                }
                            ]
                        }
                    }
                }
                else {
                    data.reply = {
                        type: 'quickReply',
                        text: msg.english.salaried.healthInsurance.fallback,
                        next: {
                            data: [
                                {
                                    data: msg.english.salaried.healthInsurance.button[0].data,
                                    text: msg.english.salaried.healthInsurance.button[0].text
                                },
                                {
                                    data: msg.english.salaried.healthInsurance.button[1].data,
                                    text: msg.english.salaried.healthInsurance.button[1].text
                                }
                            ]
                        }
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
    healthInsuranceAmt: function (data) {
        console.log('-----------health insurance amount pre-------------------')
        return new Promise(function (resolve, reject) {
            try {
                if (data && data.tags && !data.tags.healthInsuranceAmtStage) {
                    data.reply = {
                        type: 'text',
                        text: msg.english.salaried.healthInsuranceAmt.valid
                    }
                }
                else {
                    data.reply = {
                        type: 'text',
                        text: msg.english.salaried.healthInsuranceAmt.fallback
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
    homeLoan: function (data) {
        console.log('-----------home loan pre-------------------')
        return new Promise(function (resolve, reject) {
            try {
                if (data && data.tags && !data.tags.homeLoanStage) {
                    data.reply = {
                        type: 'quickReply',
                        text: msg.english.salaried.homeLoan.valid,
                        next: {
                            data: [
                                {
                                    data: msg.english.salaried.homeLoan.button[0].data,
                                    text: msg.english.salaried.homeLoan.button[0].text
                                },
                                {
                                    data: msg.english.salaried.homeLoan.button[1].data,
                                    text: msg.english.salaried.homeLoan.button[1].text
                                }
                            ]
                        }
                    }
                }
                else {
                    data.reply = {
                        type: 'quickReply',
                        text: msg.english.salaried.homeLoan.fallback,
                        next: {
                            data: [
                                {
                                    data: msg.english.salaried.homeLoan.button[0].data,
                                    text: msg.english.salaried.homeLoan.button[0].text
                                },
                                {
                                    data: msg.english.salaried.homeLoan.button[1].data,
                                    text: msg.english.salaried.homeLoan.button[1].text
                                }
                            ]
                        }
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
    otherLoan: function (data) {
        console.log('-----------other loans pre-------------------')
        return new Promise(function (resolve, reject) {
            try {
                if (data && data.tags && !data.tags.otherLoanStage) {
                    data.reply = {
                        type: 'quickReply',
                        text: msg.english.salaried.otherLoan.valid,
                        next: {
                            data: [
                                {
                                    data: msg.english.salaried.otherLoan.button[0].data,
                                    text: msg.english.salaried.otherLoan.button[0].text
                                },
                                {
                                    data: msg.english.salaried.otherLoan.button[1].data,
                                    text: msg.english.salaried.otherLoan.button[1].text
                                }
                            ]
                        }
                    }
                }
                else {
                    data.reply = {
                        type: 'quickReply',
                        text: msg.english.salaried.otherLoan.fallback,
                        next: {
                            data: [
                                {
                                    data: msg.english.salaried.otherLoan.button[0].data,
                                    text: msg.english.salaried.otherLoan.button[0].text
                                },
                                {
                                    data: msg.english.salaried.otherLoan.button[1].data,
                                    text: msg.english.salaried.otherLoan.button[1].text
                                }
                            ]
                        }
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
    emi: function (data) {
        console.log('-----------other loans pre-------------------')
        return new Promise(function (resolve, reject) {
            try {
                if (data && data.tags && !data.tags.emiStage) {
                    data.reply = {
                        type: 'text',
                        text: msg.english.salaried.emi.valid,
                    }
                }
                else {
                    data.reply = {
                        type: 'text',
                        text: msg.english.salaried.emi.fallback,
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
    phoneNo: function (data) {
        console.log("email pre stage")
        return new Promise(function (resolve, reject) {
            if (data && data.tags && !data.tags.phoneStage) {
                data.reply = {
                    type: 'text',
                    text: msg.english.salaried.phoneNo.valid
                }
            }
            else {
                console.log("----printing this-----")
                data.reply = {
                    type: 'text',
                    text: msg.english.salaried.phoneNo.fallback
                }
            }
            return resolve(data)
        })
    },
    report: function (data) {
        console.log('-----------end stage pre-------------------')
        return new Promise(async function (resolve, reject) {
            try {
                data.tags.termInsurance.ideal = 10 * 12 * parseInt(data.tags.salary)
                if(parseInt(data.tags.termInsurance.ideal) < 1000000){
                    data.tags.termInsurance.ideal = 1000000
                }
                else if (parseInt(data.tags.termInsurance.ideal) > 500000000){
                    data.tags.termInsurance.ideal = 500000000
                }
                if (parseInt(data.tags.termInsurance.current) >= parseInt(data.tags.termInsurance.ideal)){
                    data.tags.reportContent.termInsurance = '1'
                    // data.tags.english.termInsurance = msg.english.report.termInsurance.ideal
                    // data.tags.hindi.termInsurance = msg.hindi.report.termInsurance.ideal
                }
                else {
                    data.tags.reportContent.termInsurance = '0'
                    // data.tags.english.termInsurance = msg.english.report.termInsurance.notIdeal
                    // data.tags.hindi.termInsurance = msg.hindi.report.termInsurance.notIdeal
                }
                // health insurance calculation
                data.tags.healthInsurance.ideal = healthInsurance(data.tags.dependentNo)
                if (parseInt(data.tags.healthInsurance.current) >= parseInt(data.tags.healthInsurance.ideal)){
                    // data.tags.english.healthInsurance = msg.english.report.healthInsurance.ideal
                    // data.tags.hindi.healthInsurance = msg.hindi.report.healthInsurance.ideal
                    data.tags.reportContent.healthInsurance = '1'

                }
                else {
                    data.tags.reportContent.healthInsurance = '0'
                    // data.tags.english.healthInsurance = msg.english.report.healthInsurance.notIdeal
                    // data.tags.hindi.healthInsurance = msg.hindi.report.healthInsurance.notIdeal
                }
                // borrowing calculation 
                if (!data.tags.otherLoan) {
                    data.tags.borrowing.current = 0
                }
                else {
                    data.tags.borrowing.current = parseInt(data.tags.emi)
                }
                data.tags.borrowing.ideal = 0.5 * parseFloat(data.tags.salary)

                if (data && data.tags && !data.tags.homeLoan && parseInt(data.tags.salary) > 20000) {
                    data.tags.homeLoanAmt = {}
                    if ((data && data.tags && !data.tags.otherLoan) || (data && data.tags && data.tags.otherLoan && parseInt(data.tags.emi) > parseInt(data.tags.salary))) {
                        data.tags.homeLoanAmt.ideal = 60  * (parseInt(data.tags.salary))
                    }
                    else {
                        data.tags.homeLoanAmt.ideal = 60 * (parseInt(data.tags.salary) - parseInt(data.tags.emi))
                    }
                }
                //number conversion
                data.tags.emergencyFund.currentVal =await helper.amtConverter(data.tags.emergencyFund.current)
                data.tags.emergencyFund.idealVal =await helper.amtConverter(data.tags.emergencyFund.ideal)
                data.tags.investment.currentVal =await helper.amtConverter(data.tags.investment.current)
                data.tags.investment.idealVal = '> ' + await helper.amtConverter(data.tags.investment.ideal)
                data.tags.termInsurance.currentVal =await helper.amtConverter(data.tags.termInsurance.current)
                data.tags.termInsurance.idealVal = await helper.amtConverter(data.tags.termInsurance.ideal)
                data.tags.healthInsurance.currentVal = await helper.amtConverter(data.tags.healthInsurance.current)
                data.tags.healthInsurance.idealVal = await helper.amtConverter(data.tags.healthInsurance.ideal)
                data.tags.borrowing.currentVal = await helper.amtConverter(data.tags.borrowing.current)
                data.tags.borrowing.idealVal = '< ' + await helper.amtConverter(data.tags.borrowing.ideal)
                if (data && data.tags && data.tags.homeLoanAmt){
                    var homeloanVal = await helper.amtConverter(data.tags.homeLoanAmt.ideal)
                    data.tags.homeLoanAmt.idealVal = '< ' + homeloanVal
                    data.tags.reportContent.homeloan = '1'
                    data.tags.reportDynamicContent = helper.dynamicReportContent(data.tags.reportContent, homeloanVal)
                    // data.tags.english.homeloan = msg.english.report.homeloan.part1 + await helper.amtConverter(data.tags.homeLoanAmt.ideal) + msg.english.report.homeloan.part2
                    // data.tags.hindi.homeloan = msg.hindi.report.homeloan.part1 + await helper.amtConverter(data.tags.homeLoanAmt.ideal) + msg.hindi.report.homeloan.part2
                }
                else{
                    data.tags.reportDynamicContent = helper.dynamicReportContent(data.tags.reportContent, '0')
                }
                console.log(data.tags.reportDynamicContent)
                var updateCount = await dbManager.updateCollective(parseInt(data.tags.points))
                console.log(updateCount)
                var collectiveIntelligence = await dbManager.calculateIntelligence(parseInt(data.tags.points))
                data.tags.collectiveIntelligence = collectiveIntelligence
                console.log(data)
                let url =  'https://development.jubi.ai/jubimoney/report.html?id='+ data.sender
                data.reply = {
                    type: "button",
                    text: msg.english.salaried.report.valid,
                    next: {
                        data: [
                            {
                                type: "webView",
                                data: url,
                                text: msg.english.salaried.report.button[0].text
                            }
                        ]
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
    mobileNo : function (data) {
        console.log("mobile no pre stage")
        return new Promise(function (resolve, reject) {
            if (data && data.tags && !data.tags.mobileStage) {
                data.reply = {
                    type: 'text',
                    text: msg.english.salaried.mobileNo.valid,
                }
            }
            else {
                console.log("----printing this-----")
                data.reply = {
                    type: 'text',
                    text: msg.english.salaried.mobileNo.fallback,
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
                text: msg.english.salaried.end.valid,
            }
            return resolve(data)
        })
    }
}

function healthInsurance(dependentNo){
    if (parseInt(dependentNo) == 0){
        return '500000'
    }
    return '1000000'
}

