var request = require('request')
var moment = require('moment');

module.exports = {
    name: name,
    date: date
}
function name(name) {
    var obj = {
        url: "https://bot.jubi.ai/name/",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        json: { "query": name }
    }
    return runRequest(obj)
}

function date(inp) {
    var obj = {
        url: 'https://bot.jubi.ai/validator/',
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        json: {
            "expectation": {
                "type": "date",
                "input": inp,
                "min": "01-01-1910",
                "max": moment().format("DD-MM-YYYY")
            }
        }
    }
    return runRequest(obj)
}


function runRequest(options) {
    return new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            if (error) {
                console.log(error)
                return reject(error)
            }
            console.log(body)
            return resolve(body)
        })
    })
}

