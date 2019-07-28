
module.exports = {
    start: function (data) {
        console.log('-----------start getstarted pre-------------------')
        return new Promise(function (resolve, reject) {
            try {
                data.reply = {
                    type: 'quickReply',
                    text: "",
                    next: {
                        data: [
                            {
                                data: "am i saving enough?",
                                text: "Am I saving enough?"
                            }
                        ]
                    }
                }
                console.log('-----------------data resolved from pre-------------------')
                console.log(data.tags)
                return resolve(data)
            }
            catch (e) {
                console.log(e)
                return reject(e)
            }
        })
    },
    salary: function (data) {
        console.log('-----------income in button bot-------------------')
        return new Promise(function (resolve, reject) {
            try {
                data.reply = {
                    type: 'text',
                    text: "Sure! Let me help you understand that. <b> What’s your total monthly income? </b>"
                }
                return resolve(data)
            }
            catch (e) {
                console.log(e)
                return reject(e)
            }
        })
    },
    expense: function (data) {
        console.log('-----------income in button bot-------------------')
        return new Promise(function (resolve, reject) {
            try {
                data.reply = {
                    type: 'text',
                    text: "And, your avg. <b>monthly expense?</b>"
                }
                return resolve(data)
            }
            catch (e) {
                console.log(e)
                return reject(e)
            }
        })
    },
    expense: function (data) {
        console.log('-----------income in button bot-------------------')
        return new Promise(function (resolve, reject) {
            try {
                if (data && data.tags && data.tags.expensePt == '1'){
                    data.reply = {
                        type: 'text',
                        text: "You’re saving enough! PS. Remember to invest your savings for the long term."
                    }
                }
               else {
                    maxExpense = parseInt(data.tags.salary) * 0.8
                    data.reply = {
                        type: 'text',
                        text: "You can do better! You should aim to spend below" + toString(maxExpense)
                    }
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