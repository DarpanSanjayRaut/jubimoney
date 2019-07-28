'use strict'
var schema
// exports
module.exports.init = function (mongoose) {
  // creating primary schema
  let collective = {
    points:{ type : Number , unique : true, required : true, dropDups: true },
   	count:Number,
   	date:String
  }

  mongoose.Schema(collective)
  schema = mongoose.model('collective', collective)
  return schema
}

module.exports.schema = schema