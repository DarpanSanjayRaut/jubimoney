require("bot-middleware-jubi").createAdapter("test",{
     operationFileNames:{
         validate:"post",
         decorate:"pre"
     },
     adapterDirectory:__dirname+"/adapter"
 })