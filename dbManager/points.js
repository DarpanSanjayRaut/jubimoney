'use strict'
var schema
// exports
module.exports.init = function (mongoose) {
  // creating primary schema
  let userPoints = {
    senderId : { type : Number , unique : true, required : true, dropDups: true },
    point : Number,
    date:String,
    phone : String,
    email : String
  }

  mongoose.Schema(userPoints)
  schema = mongoose.model('userPoints', userPoints)
  return schema
}

module.exports.schema = schema