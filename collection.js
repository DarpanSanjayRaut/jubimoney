// var mongoose = require('mongoose');
// var url = "mongodb://jubi:jubi@uatmongo.parramato.com:27017";
// mongoose.connect(url, function (err) {
 
//    if (err) throw err;
//    var pointCount = mongoose.Schema({
//     points: Number,
//     count: Number
//     });
 
//    console.log('Successfully connected');
 
// });


// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var url = "mongodb://jubi:jubi@uatmongo.parramato.com:27017/prudentDb";

mongoose.connect(url, {useNewUrlParser: true});


var pointCount = new Schema({
   points: Number,
   count: Number
});
var collectiveIntelligence = mongoose.model('collectiveIntelligence', pointCount);

module.exports = collectiveIntelligence;
