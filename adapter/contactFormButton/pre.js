module.exports = {
    start : function(data){
        return new Promise (function (resolve) {
            data.reply = {
                type : 'quickReply',
                text : "Thanks for reaching out. What's your message about?",
                next : {
                    data : [
                        {
                            data : "know more",
                            text : "I want to know more about you"
                        },
                        {
                            data : "feedback",
                            text : "I have some feedback for you"
                        },
                        {
                            data : "advice",
                            text : "I'm looking for some advice"
                        },
                        {
                            data : "chat",
                            text : "I'd just like to chat"
                        }
                    ]
                }
            }
            return resolve(data)
        })
    },
    mobileNo :  function (data) {
        console.log("email pre stage")
        return new Promise(function (resolve, reject) {
            data.reply = {
                type: 'quickReply',
                text: "Can you help me with your mobile number?",
                next: {
                    data: [
                        {
                            data: "skip",
                            text: "Skip"
                        }
                    ]
                }
            }
            return resolve(data)
        })
    }
}