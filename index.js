var system = require('./system.json')

require("bot-middleware-jubi").Server({
    root:"https://development.jubi.ai/jubimoney",
    socketDomain: "wss://development.jubi.ai",
    socketPath: '/jubimoney/socket',
    socketLocalPath: '/socket',
    httpPort:8161,
    cluster:false,
    dbUri: system.dbUrl,
    staticDirectory:__dirname+"/static",
    adapterPath:"/adapter",
    adapterDirectory:__dirname+"/adapter",
    projectId:"JubiMoney_788585788275",
    dashbotKey:"",
    directMultiplier:1,
    fallbackMultiplier:0.8,
    passphraseMiddleware:"YGUYGgyjgblgUGIYGIGkwhbiuashbo98u9283hr9h24rqIYGI932kbidbiadsYE",
    timeoutSeconds:60,
    fcmServerKey:"AAAAYTZC9WQ:APA91bFRmKa",
    firebaseWebConfig:{
        apiKey: "sd-ZrO9xKQ",
        authDomain: "on-f31.firebaseapp.com",
        databaseURL: "https://on-f31.firebaseio.com",
        projectId: "on-f31",
        storageBucket: "",
        messagingSenderId: "4175221234234"
    }
},()=>{
    //TO DO AFTER INITIALIZATION
    require("bot-middleware-jubi").facebook({
         verificationToken:"facebook",
         pageAccessToken:"EAAfoo1qXphEBADC81YfLYwFabeIiaZAgacoipN3ZBlQn6b6MQxMMOyiswFVst9Nw68fJcVYqodquDTsESC9vx1PFLYeWJlZAA4M9diXbHwPCKkxgO1PXkF8NmlHBjZA6PCzHEoT4kdPBxnzZALNQZBdQsyriAMxBmDaUgBDTwEWgCHgPbluape",
         path:"/fb"
    })
})