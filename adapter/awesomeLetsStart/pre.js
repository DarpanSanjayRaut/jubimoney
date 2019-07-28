var msg = require('../../lang.json');

module.exports = {
    letsStart : function(data){
        return new Promise (function (resolve) {
            data.reply = {
                type : 'quickReply',
                text : msg.english.awesomeLetsStart.letsStart.valid,
                next : {
                    data : [
                        {
                            data : msg.english.awesomeLetsStart.letsStart.button[0].data,
                            text : msg.english.awesomeLetsStart.letsStart.button[0].text
                        },
                        {
                            data : msg.english.awesomeLetsStart.letsStart.button[1].data,
                            text : msg.english.awesomeLetsStart.letsStart.button[1].text
                        },
                        {
                            data : msg.english.awesomeLetsStart.letsStart.button[2].data,
                            text : msg.english.awesomeLetsStart.letsStart.button[2].text
                        },
                        {
                            data : msg.english.awesomeLetsStart.letsStart.button[3].data,
                            text : msg.english.awesomeLetsStart.letsStart.button[3].text
                        }
                    ]
                }
            }
            return resolve(data)
        })
    },
    name : function(data){
        return new Promise (function (resolve) {
            if(data && data.tags && !data.tags.nameStage){
                data.reply = {
                    type : 'text',
                    text : msg.english.awesomeLetsStart.name.valid
                }
            }
            else {
                data.reply = {
                    type : 'text',
                    text : msg.english.awesomeLetsStart.name.fallback
                }
            }
            return resolve(data)
        })
    },
    nameCheck : function(data){
        return new Promise (function (resolve) {
            if(data && data.tags && !data.tags.nameCheckStage){
                data.reply = {
                    type : 'quickReply',
                    text : data.tags.name + msg.english.awesomeLetsStart.nameCheck.valid,
                    next : {
                        data : [
                            {
                                data : msg.english.awesomeLetsStart.nameCheck.button[0].data,
                                text : msg.english.awesomeLetsStart.nameCheck.button[0].text
                            },
                            {
                                data : msg.english.awesomeLetsStart.nameCheck.button[1].data,
                                text : msg.english.awesomeLetsStart.nameCheck.button[1].text
                            }
                        ]
                    }
                }
            }
            else {
                data.reply = {
                    type : 'quickReply',
                    text : msg.english.awesomeLetsStart.nameCheck.fallback,
                    next : {
                        data : [
                            {
                                data : msg.english.awesomeLetsStart.nameCheck.button[0].data,
                                text : msg.english.awesomeLetsStart.nameCheck.button[0].text
                            },
                            {
                                data : msg.english.awesomeLetsStart.nameCheck.button[1].data,
                                text : msg.english.awesomeLetsStart.nameCheck.button[1].text
                            }
                        ]
                    }
                }
            }
            return resolve(data)
        })
    },
    age : function(data){
        return new Promise (function (resolve) {
            if(data && data.tags && !data.tags.dobStage){
                data.reply = {
                    type : 'text',
                    text : 'Thanks '+ data.tags.name.split(" ")[0] + msg.english.awesomeLetsStart.age.valid 
                }
            }
            else{
                data.reply = {
                    type : 'text',
                    text : msg.english.awesomeLetsStart.age.fallback 
                }
            }
            return resolve(data)
        })
    },
    gender : function(data){
        return new Promise (function (resolve) {
            if(data && data.tags && !data.tags.genderStage){
                data.reply = {
                    type : 'quickReply',
                    text : msg.english.awesomeLetsStart.gender.valid,
                    next : {
                        data : [
                            {
                                data : msg.english.awesomeLetsStart.gender.button[0].data,
                                text : msg.english.awesomeLetsStart.gender.button[0].text
                            },
                            {
                                data : msg.english.awesomeLetsStart.gender.button[1].data,
                                text : msg.english.awesomeLetsStart.gender.button[1].text
                            },
                            {
                                data : msg.english.awesomeLetsStart.gender.button[2].data,
                                text : msg.english.awesomeLetsStart.gender.button[2].text
                            }
                        ]
                    }
                }
            }
            else {
                data.reply = {
                    type : 'quickReply',
                    text : msg.english.awesomeLetsStart.gender.fallback,
                    next : {
                        data : [
                            {
                                data : msg.english.awesomeLetsStart.gender.button[0].data,
                                text : msg.english.awesomeLetsStart.gender.button[0].text
                            },
                            {
                                data : msg.english.awesomeLetsStart.gender.button[1].data,
                                text : msg.english.awesomeLetsStart.gender.button[1].text
                            },
                            {
                                data : msg.english.awesomeLetsStart.gender.button[2].data,
                                text : msg.english.awesomeLetsStart.gender.button[2].text
                            }
                        ]
                    }
                }
            }
            return resolve(data)
        })
    },
    relationship : function(data){
        return new Promise (function (resolve) {
            if(data && data.tags && !data.tags.relationshipStage){
                data.reply = {
                    type : 'quickReply',
                    text : msg.english.awesomeLetsStart.relationship.valid,
                    next : {
                        data : [
                            {
                                data : msg.english.awesomeLetsStart.relationship.button[0].data,
                                text : msg.english.awesomeLetsStart.relationship.button[0].text
                            },
                            {
                                data : msg.english.awesomeLetsStart.relationship.button[1].data,
                                text : msg.english.awesomeLetsStart.relationship.button[1].text
                            }
                        ]
                    }
                }
            }
            else {
                data.reply = {
                    type : 'quickReply',
                    text : msg.english.awesomeLetsStart.relationship.fallback,
                    next : {
                        data : [
                            {
                                data : msg.english.awesomeLetsStart.relationship.button[0].data,
                                text : msg.english.awesomeLetsStart.relationship.button[0].text
                            },
                            {
                                data : msg.english.awesomeLetsStart.relationship.button[1].data,
                                text : msg.english.awesomeLetsStart.relationship.button[1].text
                            }
                        ]
                    }
                }
            }
            return resolve(data)
        })
    },
    occupation : function(data){
        return new Promise (function (resolve) {
            data.reply = {
                type : 'quickReply',
                text : 'Next I\'d like to know more about the nature of your job. |break| Now, which of these apply to you? 🤔',
                next : {
                    data : [
                        {
                            data : 'salaried',
                            text : 'Salaried'
                        },
                        {
                            data : 'professional',
                            text : 'Professional'
                        },
                        {
                            data : 'business person',
                            text : 'Business Person'
                        },
                        {
                            data : 'freelancer',
                            text : 'Freelancer'
                        },
                        {
                            data : 'retired',
                            text : 'Retired'
                        },
                        {
                            data : 'unemployed',
                            text : 'Unemployed'
                        }
                    ]
                }
            }
            return resolve(data)
        })
    }
}