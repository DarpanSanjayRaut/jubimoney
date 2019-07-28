var msg = require('../../lang.json');

module.exports = {
    letsStart : function(data){
        console.log('-----------hindi awespme lets start---------')
        return new Promise (function (resolve) {
            data.reply = {
                type : 'quickReply',
                text : msg.hindi.awesomeLetsStart.letsStart.valid,
                next : {
                    data : [
                        {
                            data : msg.hindi.awesomeLetsStart.letsStart.button[0].data,
                            text : msg.hindi.awesomeLetsStart.letsStart.button[0].text
                        },
                        {
                            data : msg.hindi.awesomeLetsStart.letsStart.button[1].data,
                            text : msg.hindi.awesomeLetsStart.letsStart.button[1].text
                        },
                        {
                            data : msg.hindi.awesomeLetsStart.letsStart.button[2].data,
                            text : msg.hindi.awesomeLetsStart.letsStart.button[2].text
                        },
                        {
                            data : msg.hindi.awesomeLetsStart.letsStart.button[3].data,
                            text : msg.hindi.awesomeLetsStart.letsStart.button[3].text
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
                    text : msg.hindi.awesomeLetsStart.name.valid
                }
            }
            else {
                data.reply = {
                    type : 'text',
                    text : msg.hindi.awesomeLetsStart.name.fallback
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
                    text : data.tags.name + msg.hindi.awesomeLetsStart.nameCheck.valid,
                    next : {
                        data : [
                            {
                                data : msg.hindi.awesomeLetsStart.nameCheck.button[0].data,
                                text : msg.hindi.awesomeLetsStart.nameCheck.button[0].text
                            },
                            {
                                data : msg.hindi.awesomeLetsStart.nameCheck.button[1].data,
                                text : msg.hindi.awesomeLetsStart.nameCheck.button[1].text
                            }
                        ]
                    }
                }
            }
            else {
                data.reply = {
                    type : 'quickReply',
                    text : msg.hindi.awesomeLetsStart.nameCheck.fallback,
                    next : {
                        data : [
                            {
                                data : msg.hindi.awesomeLetsStart.nameCheck.button[0].data,
                                text : msg.hindi.awesomeLetsStart.nameCheck.button[0].text
                            },
                            {
                                data : msg.hindi.awesomeLetsStart.nameCheck.button[1].data,
                                text : msg.hindi.awesomeLetsStart.nameCheck.button[1].text
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
                    text : msg.hindi.awesomeLetsStart.age.valid 
                }
            }
            else{
                data.reply = {
                    type : 'text',
                    text : msg.hindi.awesomeLetsStart.age.fallback 
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
                    text : msg.hindi.awesomeLetsStart.gender.valid,
                    next : {
                        data : [
                            {
                                data : msg.hindi.awesomeLetsStart.gender.button[0].data,
                                text : msg.hindi.awesomeLetsStart.gender.button[0].text
                            },
                            {
                                data : msg.hindi.awesomeLetsStart.gender.button[1].data,
                                text : msg.hindi.awesomeLetsStart.gender.button[1].text
                            },
                            {
                                data : msg.hindi.awesomeLetsStart.gender.button[2].data,
                                text : msg.hindi.awesomeLetsStart.gender.button[2].text
                            }
                        ]
                    }
                }
            }
            else {
                data.reply = {
                    type : 'quickReply',
                    text : msg.hindi.awesomeLetsStart.gender.fallback,
                    next : {
                        data : [
                            {
                                data : msg.hindi.awesomeLetsStart.gender.button[0].data,
                                text : msg.hindi.awesomeLetsStart.gender.button[0].text
                            },
                            {
                                data : msg.hindi.awesomeLetsStart.gender.button[1].data,
                                text : msg.hindi.awesomeLetsStart.gender.button[1].text
                            },
                            {
                                data : msg.hindi.awesomeLetsStart.gender.button[2].data,
                                text : msg.hindi.awesomeLetsStart.gender.button[2].text
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
                    text : msg.hindi.awesomeLetsStart.relationship.valid,
                    next : {
                        data : [
                            {
                                data : msg.hindi.awesomeLetsStart.relationship.button[0].data,
                                text : msg.hindi.awesomeLetsStart.relationship.button[0].text
                            },
                            {
                                data : msg.hindi.awesomeLetsStart.relationship.button[1].data,
                                text : msg.hindi.awesomeLetsStart.relationship.button[1].text
                            }
                        ]
                    }
                }
            }
            else {
                data.reply = {
                    type : 'quickReply',
                    text : msg.hindi.awesomeLetsStart.relationship.fallback,
                    next : {
                        data : [
                            {
                                data : msg.hindi.awesomeLetsStart.relationship.button[0].data,
                                text : msg.hindi.awesomeLetsStart.relationship.button[0].text
                            },
                            {
                                data : msg.hindi.awesomeLetsStart.relationship.button[1].data,
                                text : msg.hindi.awesomeLetsStart.relationship.button[1].text
                            }
                        ]
                    }
                }
            }
            return resolve(data)
        })
    }
    // occupation : function(data){
    //     return new Promise (function (resolve) {
    //         data.reply = {
    //             type : 'quickReply',
    //             text : 'आप इनमें से क्या हैं?',
    //             next : {
    //                 data : [
    //                     {
    //                         data : 'salaried',
    //                         text : 'Salaried'
    //                     },
    //                     {
    //                         data : 'professional',
    //                         text : 'Professional'
    //                     },
    //                     {
    //                         data : 'business person',
    //                         text : 'Business Person'
    //                     },
    //                     {
    //                         data : 'freelancer',
    //                         text : 'Freelancer'
    //                     },
    //                     {
    //                         data : 'retired',
    //                         text : 'Retired'
    //                     },
    //                     {
    //                         data : 'unemployed',
    //                         text : 'Unemployed'
    //                     }
    //                 ]
    //             }
    //         }
    //         return resolve(data)
    //     })
    // }
}