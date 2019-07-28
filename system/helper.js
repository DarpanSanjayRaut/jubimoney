let matchAll = require('match-all')
var msg = require('../lang.json');

module.exports = {
    extractAmount: extractAmount,
    extractEmail: extractEmail,
    amtConverter: amtConverter,
    hindiMonth : hindiMonth,
    expensePoint : expensePoint,
    emergencyPoint : emergencyPoint,
    investPoint : investPoint,
    insurancePoint : insurancePoint,
    emiPoint : emiPoint,
    numHindiToeng : numHindiToeng,
    percentCal : percentCal,
    extractMobile : extractMobile,
    dynamicReportContent : dynamicReportContent
}

function extractAmount(data) {
    return new Promise(function (resolve, reject) {
        let lowerData = data.toLowerCase()
        if (lowerData.includes(',')) {
            while (lowerData.includes(',')) {
                data = data.replace(',', '')
                lowerData = lowerData.replace(',', '')
            }
        }
        if (lowerData.match(/\d+(\s*)?(k|thousand|thousands|हजार)/)) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
            let a = lowerData
            a = a.match(/\d+\s*(k|thousand|thousands|हजार)/)[0].replace(/\s+/, '').replace('k', '000').replace('thousand', '000').replace('thousands', '000').replace('हजार', '000')
            lowerData = lowerData.replace(/\d+\s*(k|thousand|thousands|हजार)/, a)
            let text = matchAll(lowerData, /(\d+)/gi).toArray()
            for (let i in text) {
                if (text[i].length < 12) {
                    if (!lowerData.includes("-" + text[i])) {
                        amount = text[i]
                    }
                    data = data.replace(text[i], '')
                    break;
                }
            }
        } else if (lowerData.match(/\d+(\s*)?(lakh|lac|l|लाख)/)) {
            console.log("::::::::::::::::::::::::::::::::::::")
            let a = lowerData
            a = a.match(/\d+\s*(lakh|lac|l|लाख)/)[0].replace(/\s+/, '').replace('lakhs', '00000').replace('lakh', '00000').replace('lacs', '00000').replace('l', '00000').replace('लाख', '00000')
            lowerData = lowerData.replace(/\d+\s*(lakh|lac|l|लाख)/, a)
            let text = matchAll(lowerData, /(\d+)/gi).toArray()
            for (let i in text) {
                if (text[i].length < 12) {
                    if (!lowerData.includes("-" + text[i])) {
                        amount = text[i]
                    }
                    data = data.replace(text[i], '')
                    break;
                }
            }
        } else if (lowerData.match(/\d+(\s*)?(crore|cr|crores|करोड़)/)) {
            console.log("::::::::::::::::::::::::::::::::::::")
            let a = lowerData
            a = a.match(/\d+\s*(crore|cr|करोड़)/)[0].replace(/\s+/, '').replace('crore', '0000000').replace('cr', '0000000').replace('crores', '0000000').replace('करोड़', '0000000')
            lowerData = lowerData.replace(/\d+\s*(crore|cr|करोड़)/, a)
            let text = matchAll(lowerData, /(\d+)/gi).toArray()
            for (let i in text) {
                if (text[i].length < 12) {
                    if (!lowerData.includes("-" + text[i])) {
                        amount = text[i]
                    }
                    data = data.replace(text[i], '')
                    break;
                }
            }
        }
        else if (lowerData.match(/\d+/) && lowerData.match(/\d+/)[0].length >= 0 && lowerData.match(/\d+/)[0].length <= 3) {
            console.log("::::::::::<<<<<<<<<model.tags.securedType == pl>>>>>>>>>:::::::::::::")
            let a = lowerData
            a = a.match(/\d+/)[0]
            console.log(a)
            lowerData = lowerData.replace(/\d+/, a)
            let text = matchAll(lowerData, /(\d+)/gi).toArray()
            for (let i in text) {
                if (text[i].length < 12) {
                    if (!lowerData.includes("-" + text[i])) {
                        amount = text[i]
                    }
                    data = data.replace(text[i], '')
                    break;
                }
            }
        }
        else if (lowerData.match(/\d+/) && lowerData.match(/\d+/)[0].length >= 4 && lowerData.match(/\d+/)[0].length <= 12) {
            console.log("::::::::::<<<<<<<<<model.tags.securedType = existing>>>>>>>>>:::::::::::::")
            let a = lowerData
            a = a.match(/\d+/)[0]
            console.log(a)
            lowerData = lowerData.replace(/\d+/, a)
            let text = matchAll(lowerData, /(\d+)/gi).toArray()
            for (let i in text) {
                if (text[i].length < 12) {
                    if (!lowerData.includes("-" + text[i])) {
                        amount = text[i]
                    }
                    data = data.replace(text[i], '')
                    break;
                }
            }
        } else if (lowerData.match(/\d+/) && lowerData.match(/\d+/)[0].length >= 4 && lowerData.match(/\d+/)[0].length <= 7) {
            console.log("::::::::::<<<<<<<<<model.tags.securedType == pl>>>>>>>>>:::::::::::::")
            let a = lowerData
            a = a.match(/\d+/)[0]
            console.log(a)
            lowerData = lowerData.replace(/\d+/, a)
            let text = matchAll(lowerData, /(\d+)/gi).toArray()
            for (let i in text) {
                if (text[i].length < 12) {
                    if (!lowerData.includes("-" + text[i])) {
                        amount = text[i]
                    }
                    data = data.replace(text[i], '')
                    break;
                }
            }
        }
        else {
            console.log('------invalid data type-------' + data)
            amount = 'invalid'
        }
        console.log("::::::::::::::extractAmount response")
        console.log(amount + '---------------' + data)
        return resolve(amount);
    });
}

function extractEmail(data) {
    return new Promise(function (resolve, reject) {

        if (data.match(/([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/)) {
            email = data.match(/([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/)[0]
            return resolve(email);
        }
        return resolve("Invalid");
    });
}

function amtConverter(amount) {
    return new Promise((resolve, reject) => {
        try {
            console.log(amount)
            amount = amount.toString()
            if (amount.match(/^\d+$/)) {
                // console
                value = parseInt(amount)
                if (value >= 100000 && value <= 999999) {
                    if (parseInt(amount[1]) == 0 && parseInt(amount[2]) == 0) {
                        amtToWords = amount[0] + ' Lacs'
                        return resolve(amtToWords)
                    }
                    else if (parseInt(amount[1]) == 0 && parseInt(amount[2]) > 0) {
                        amtToWords = amount[0] + '.0' + amount[2] + ' Lacs'
                        return resolve(amtToWords)
                    }
                    else {
                        amtToWords = amount[0] + '.' + amount[1] + amount[2] + ' Lacs'
                        return resolve(amtToWords)
                    }
                }
                else if (value >= 1000000 && value <= 9999999) {
                    if (parseInt(amount[2]) == 0 && parseInt(amount[3]) == 0) {
                        amtToWords = amount[0] + amount[1] + ' Lacs'
                        return resolve(amtToWords)
                    }
                    else if (parseInt(amount[2]) == 0 && parseInt(amount[3]) > 0) {
                        amtToWords = amount[0] + amount[1] + '.0' + amount[3] + ' Lacs'
                        return resolve(amtToWords)
                    }
                    else {
                        amtToWords = amount[0] + amount[1] + '.' + amount[2] + amount[3] + ' Lacs'
                        return resolve(amtToWords)
                    }
                }
                else if (value >= 10000000 && value <= 99999999) {
                    if (parseInt(amount[1]) == 0 && parseInt(amount[2]) == 0) {
                        amtToWords = amount[0] + ' Cr'
                        return resolve(amtToWords)
                    }
                    else if (parseInt(amount[1]) == 0 && parseInt(amount[2]) > 0) {
                        amtToWords = amount[0] + '.0' + amount[2] + ' Cr'
                        return resolve(amtToWords)
                    }
                    else {
                        amtToWords = amount[0] + '.' + amount[1] + amount[2] + ' Cr'
                        return resolve(amtToWords)
                    }
                }
                else if (value >= 100000000 && value <= 999999999) {
                    if (parseInt(amount[2]) == 0 && parseInt(amount[3]) == 0) {
                        amtToWords = amount[0] + amount[1] + ' Cr'
                        return resolve(amtToWords)
                    }
                    else if (parseInt(amount[2]) == 0 && parseInt(amount[3]) > 0) {
                        amtToWords = amount[0] + amount[1] + '.0' + amount[3] + ' Cr'
                        return resolve(amtToWords)
                    }
                    else {
                        amtToWords = amount[0] + amount[1] + '.' + amount[2] + amount[3] + ' Cr'
                        return resolve(amtToWords)
                    }
                }
                else if (value > 999999999){
                    amtToWords = '99+ Cr'
                    return resolve(amtToWords)
                }
                else return resolve(value)
            }
            return resolve("invalid")
        }
        catch (e) {
            console.log(e)
            return reject(e)
        }
    })
}

function hindiMonth(month) {
    return new Promise((resolve, reject) => {
        try {
            switch (month) {
                case "जनवरी": console.log(month + 'jan')
                    return resolve('January')
                case "फरवरी": console.log(month + 'feb')
                    return resolve('february')
                case "मार्च": console.log(month + 'mar')
                    return resolve('March')
                case "अप्रैल": console.log(month + 'April')
                    return resolve('April')
                case "मई": console.log(month + 'May')
                    return resolve('May')
                case "जून": console.log(month + 'June')
                    return resolve('June')
                case "जुलाई": console.log(month + 'July')
                    return resolve('July')
                case "अगस्त": console.log(month + 'August')
                    return resolve('August')
                case "सितंबर": console.log(month + 'September')
                    return resolve('September')
                case "अक्टूबर": console.log(month + 'October')
                    return resolve('October')
                case "नवंबर": console.log(month + 'November')
                    return resolve('November')
                case "दिसंबर": console.log(month + 'December')
                    return resolve('December')
                default: console.log('Didnt work')
                    return resolve('invalid')
            }
        }
        catch (e) {
            console.log(e)
            return reject(e)
        }
    })
}

function expensePoint (income, expense){
    return new Promise ((resolve, reject) =>{
        try {
            let resultValue = 0;
            if(!income || !expense){
                return reject ("No data found")
            }
            var percent = parseFloat(expense) * 100 / parseFloat(income)
            console.log(percent + ':::::::::::::::::')
            if (percent >= 50){
                resultValue = 1
            }
            else if(percent > 50 || percent >= 25) {
                resultValue = 2
            }
            else {
                resultValue = 3
            }
            return resolve(resultValue)
        }
        catch (e){
            console.log(e)
            return reject(e)
        }
    })
}

function emergencyPoint (expense, emergencyFund){
    return new Promise ((resolve, reject) =>{
        try {
            let resultValue = 0;
            if(!expense || !emergencyFund){
                return reject ("No data found")
            }
            if (parseInt(expense) == 0 || parseInt(emergencyFund) == 0){
                resultValue = 1
                return resolve(resultValue)
            }
            var multiple = parseFloat(emergencyFund) / parseFloat(expense)
            if (multiple < 2){
                console.log(multiple)
                resultValue = 1
            }
            else if (multiple >= 2 || multiple < 3 ){
                console.log(multiple)
                resultValue = 2
            }
            else {
                console.log(multiple)
                resultValue = 3
            }
            return resolve (resultValue)
        }
        catch (e){
            console.log(e)
            return reject(e)
        }
    })
}

function investPoint (income, invest){
    return new Promise ((resolve, reject) =>{
        try {
            let resultValue = 0;
            if(!income || !invest){
                return reject ("No data found")
            }
            if ( parseInt(invest) == 0){
                resultValue = 1
                return resolve(resultValue)
            }
            var percent = parseFloat(invest) * 100 / parseFloat(income)
            if (percent < 20){
                resultValue = 2
            }
            else {
                resultValue = 3
            }
            return resolve (resultValue)
        }
        catch (e){
            console.log(e)
            return reject(e)
        }
    })
}

function insurancePoint (term, health){
    return new Promise ((resolve, reject) =>{
        try {
            let resultValue = 0;
            if(!term || !health){
                return reject ("No data found")
            }
            if (term == 'no' && health == 'no'){
                resultValue = 1
            }
            else if ((term == 'yes' && health == 'no') || (term == 'no' && health == 'yes')){
                resultValue = 2
            }
            else {
                resultValue = 3
            }
            return resolve (resultValue)
        }
        catch (e){
            console.log(e)
            return reject(e)
        }
    })
}

function emiPoint (income, emi){
    return new Promise ((resolve, reject) =>{
        try {
            let resultValue = 0;
            if(!income || !emi){
                return reject ("No data found")
            }
            var percent = parseFloat(emi) * 100 / parseFloat(income)
            if (percent < 50){
                resultValue = 2
            }
            else {
                resultValue = 1
            }
            return resolve (resultValue)
        }
        catch (e){
            console.log(e)
            return reject(e)
        }
    })
}

function numHindiToeng (data){
	if (typeof(data) != 'string'){
		data = data.toString()
	}
	if (data.match(/[०-९]/)){
		while(data.match(/[०-९]/)){
			if (data.match(/[०-९]/)[0] == '०'){
				data = data.replace(data.match(/[०-९]/)[0], '0')
			}
			else if (data.match(/[०-९]/)[0] == '१'){
				data = data.replace(data.match(/[०-९]/)[0], '1')
			}
			else if (data.match(/[०-९]/)[0] == '२'){
				data = data.replace(data.match(/[०-९]/)[0], '2')
			}
			else if (data.match(/[०-९]/)[0] == '३'){
				data = data.replace(data.match(/[०-९]/)[0], '3')
			}
			else if (data.match(/[०-९]/)[0] == '४'){
				data = data.replace(data.match(/[०-९]/)[0], '4')
			}
			else if (data.match(/[०-९]/)[0] == '५'){
				data = data.replace(data.match(/[०-९]/)[0], '5')
			}
			else if (data.match(/[०-९]/)[0] == '६'){
				data = data.replace(data.match(/[०-९]/)[0], '6')
			}
			else if (data.match(/[०-९]/)[0] == '७'){
				data = data.replace(data.match(/[०-९]/)[0], '7')
			}
			else if (data.match(/[०-९]/)[0] == '८'){
				data = data.replace(data.match(/[०-९]/)[0], '8')
			}
			else if (data.match(/[०-९]/)[0] == '९'){
				data = data.replace(data.match(/[०-९]/)[0], '9')
			}
			else {
                return ('didnt work')
                
			}
		}
	}
	else {
		return ('not')
	}
	return (data)
}

function percentCal (numerator, denominator){
    var percentage = numerator * 100 / denominator
    return (percentage)
}

function extractMobile(data) {
    return new Promise(function (resolve, reject) {
        let textData = data.match(/\d+/)
        if (textData) {
            let text = textData[0]
            // console.log(text)
            if (text) {
                if (text.length == 10) {
                    text = data.match(/[6789]\d{9}/)[0]
                    if (text) {
                        return resolve (text)
                    }
                }
                else if (text.length == 11 && text.startsWith("0")) {
                    text = data.match(/0[6789]\d{9}/)[0]
                    if (text) {
                        return resolve (text.substring(1))
                    }
                }
                else if (text.length == 12 && text.startsWith("91")) {
                    text = data.match(/91[6789]\d{9}/)[0]
                    if (text) {
                        return resolve (text.substring(2))
                    }
                }
                else {
                	return resolve("invalid")
                }
            }
            else {
                return resolve("invalid")
            }
        }
        else {
            return resolve("invalid")
        }
    });
}

function dynamicReportContent (data, homeloanAmt){
    var dynamicContent = {english : {} , hindi: {}, marathi : {}, kannada : {}, tamil: {}}
    console.log(dynamicContent)
    if (data.emergencyFund == '1'){
        dynamicContent.english.emergencyFund = msg.english.report.emergencyFund.ideal
        dynamicContent.hindi.emergencyFund = msg.hindi.report.emergencyFund.ideal
        dynamicContent.marathi.emergencyFund = msg.marathi.report.emergencyFund.ideal
        dynamicContent.kannada.emergencyFund = msg.kannada.report.emergencyFund.ideal
        dynamicContent.tamil.emergencyFund = msg.tamil.report.emergencyFund.ideal
    }
    else {
        dynamicContent.english.emergencyFund = msg.english.report.emergencyFund.notIdeal
        dynamicContent.hindi.emergencyFund = msg.hindi.report.emergencyFund.notIdeal
        dynamicContent.marathi.emergencyFund = msg.marathi.report.emergencyFund.notIdeal
        dynamicContent.kannada.emergencyFund = msg.kannada.report.emergencyFund.notIdeal
        dynamicContent.tamil.emergencyFund = msg.tamil.report.emergencyFund.notIdeal
    }
    console.log('---------------checked first condition for emergency fund-------------')
    if (data.termInsurance == '1'){
        dynamicContent.english.termInsurance = msg.english.report.termInsurance.ideal
        dynamicContent.hindi.termInsurance = msg.hindi.report.termInsurance.ideal
        dynamicContent.marathi.termInsurance = msg.marathi.report.termInsurance.ideal
        dynamicContent.kannada.termInsurance = msg.kannada.report.termInsurance.ideal
        dynamicContent.tamil.termInsurance = msg.tamil.report.termInsurance.ideal
    }
    else {
        dynamicContent.english.termInsurance = msg.english.report.termInsurance.notIdeal
        dynamicContent.hindi.termInsurance = msg.hindi.report.termInsurance.notIdeal
        dynamicContent.marathi.termInsurance = msg.marathi.report.termInsurance.notIdeal
        dynamicContent.kannada.termInsurance = msg.kannada.report.termInsurance.notIdeal
        dynamicContent.tamil.termInsurance = msg.tamil.report.termInsurance.notIdeal
    }
    console.log('---------------checked first condition for termInsurance-------------')
    if (data.healthInsurance == '1'){
        dynamicContent.english.healthInsurance = msg.english.report.healthInsurance.ideal
        dynamicContent.hindi.healthInsurance = msg.hindi.report.healthInsurance.ideal
        dynamicContent.marathi.healthInsurance = msg.marathi.report.healthInsurance.ideal
        dynamicContent.kannada.healthInsurance = msg.kannada.report.healthInsurance.ideal
        dynamicContent.tamil.healthInsurance = msg.tamil.report.healthInsurance.ideal
    }
    else {
        dynamicContent.english.healthInsurance = msg.english.report.healthInsurance.notIdeal
        dynamicContent.hindi.healthInsurance = msg.hindi.report.healthInsurance.notIdeal
        dynamicContent.marathi.healthInsurance = msg.marathi.report.healthInsurance.notIdeal
        dynamicContent.kannada.healthInsurance = msg.kannada.report.healthInsurance.notIdeal
        dynamicContent.tamil.healthInsurance = msg.tamil.report.healthInsurance.notIdeal
    }
    console.log('---------------checked first condition for healthInsurance-------------')

    if (data.investment == '1'){
        dynamicContent.english.investment = msg.english.report.Investment.ideal
        dynamicContent.hindi.investment = msg.hindi.report.Investment.ideal
        dynamicContent.marathi.investment = msg.marathi.report.Investment.ideal
        dynamicContent.kannada.investment = msg.kannada.report.Investment.ideal
        dynamicContent.tamil.investment = msg.tamil.report.Investment.ideal
    }
    else {
        dynamicContent.english.investment = msg.english.report.Investment.notIdeal
        dynamicContent.hindi.investment = msg.hindi.report.Investment.notIdeal
        dynamicContent.marathi.investment = msg.marathi.report.Investment.notIdeal
        dynamicContent.kannada.investment = msg.kannada.report.Investment.notIdeal
        dynamicContent.tamil.investment = msg.tamil.report.Investment.notIdeal
    }
    console.log('---------------checked first condition for Investment-------------')
    if (data.homeloan == '1'){
        dynamicContent.english.homeloan = msg.english.report.homeloan.part1 + homeloanAmt + msg.english.report.homeloan.part2
        dynamicContent.hindi.homeloan = msg.hindi.report.homeloan.part1 + homeloanAmt + msg.hindi.report.homeloan.part2
        dynamicContent.marathi.homeloan = msg.marathi.report.homeloan.part1 + homeloanAmt + msg.marathi.report.homeloan.part2
        dynamicContent.kannada.homeloan = msg.kannada.report.homeloan.part1 + homeloanAmt + msg.kannada.report.homeloan.part2
        dynamicContent.tamil.homeloan = msg.tamil.report.homeloan.part1 + homeloanAmt + msg.tamil.report.homeloan.part2
    }
    else {
        var homeloan = 'no home load'
    }
    return dynamicContent 

}

// console.log(dynamicReportContent({emergencyFund: '0', termInsurance : '1', healthInsurance : '1', investment : '0', homeloan : '1'}, '5 lacs'))