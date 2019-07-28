let mongoose = require('mongoose')
let dbOps = require('./operations.js')
let pointsSchm = require('./points.js').init(mongoose);
let collectiveSchm = require('./collective.js').init(mongoose);
let system = require('../system.json')

let url = system.dbUrl;


function dbConnection() {
  mongoose.connect(url, function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log('Connected to mongodb!')
    }
  })
}

function readCollective(data, callback) {
  let model = {
    dbOpsType: 'read',
    data: data,
    pageNo: 1,
    readLimit: 100,
    offset: 0,
    schema: collectiveSchm
  }
  dbOps(model, (err, doc) => {
    callback(err, doc)
    console.log(JSON.stringify(doc) + err)
  });
}

function createCollective(data) {
  let model = {
    dbOpsType: 'create',
    data: data,
    schema: collectiveSchm
  }
  dbOps(model, (err, doc) => {
    console.log(JSON.stringify(doc) + err)
  });
}

function createPoints(data) {
  let model = {
    dbOpsType: 'create',
    data: data,
    schema: pointsSchm
  }
  dbOps(model, (err, doc) => {
    console.log(JSON.stringify(doc) + err)
  });
}

function updateCollective(points){
  return new Promise (async (resolve, reject) =>{
    let model = {
      dbOpsType: 'singleupsert',
      record: {
        points : points,
        count : await getTotalUsersByPoints(points)
      },
      schema: collectiveSchm,
      matchKey : 'points'
    }
    dbOps(model, (err, doc) => {
      console.log(JSON.stringify(doc) + err)
      if(err) {
        return reject(err)
      }
      return resolve(doc)
    });
  })
  
}



/*
1. get total count of users points
2. get count of users with points greater than current user points (Collective)
3. sum counts of users read from points collection 
*/

function calculateIntelligence(points) {
  return new Promise(async (resolve, reject)=>{
    try {
      let totalUserCount = await getTotalUsers();
      let usersGTECurrentPoint = await getUsersPointsGTECurrent(points);

      console.log('-------usersGTECurrentPoint ' + usersGTECurrentPoint)
      rank = 0
      if(usersGTECurrentPoint && usersGTECurrentPoint.length > 0) {
        for (i = 0 ; i < usersGTECurrentPoint.length ; i++){
          rank = rank + usersGTECurrentPoint[i]['count']
        }
        console.log(rank)
      }
      console.log('totalUSerCount ' + totalUserCount)
      console.log('rank of current user ' + rank)
      var percentile = (totalUserCount - rank ) * 100 / totalUserCount;
      return resolve(percentile)
    } catch(e) {
      console.log(e)
      return reject(e)
    }
  })
}

function getUsersPointsGTECurrent(currentUserPoint){
  return new Promise(async (resolve, reject)=>{
    let model = {
      dbOpsType: 'read',
      data: {
        points : { $gt : currentUserPoint}
      },
      pageNo: 1,
      readLimit: 100,
      offset: 0,
      schema: collectiveSchm
    }
    dbOps(model, (err, doc) => {
      console.log(JSON.stringify(doc) + err)
      if(err) {
        return reject(err)
      }
      return resolve(doc)
    });

  })  
}

function getTotalUsersByPoints(points){
  return new Promise(async (resolve, reject)=>{
    let model = {
      dbOpsType: 'count',
      data: {
        point : points
      },
      pageNo: 1,
      readLimit: 100,
      offset: 0,
      schema: pointsSchm
    }
    dbOps(model, (err, doc) => {
      console.log(JSON.stringify(doc) + err + 'ok ::: count')
      if(err) {
        return reject(err)
      }
      return resolve(doc)
    });

  })  
}

function getTotalUsers(){
  return new Promise(async (resolve, reject)=>{
    let model = {
      dbOpsType: 'count',
      data: {},
      pageNo: 1,
      readLimit: 100,
      offset: 0,
      schema: pointsSchm
    }
    dbOps(model, (err, doc) => {
      console.log(JSON.stringify(doc) + err)
      if(err) {
        return reject(err)
      }
      return resolve(doc)
    });

  })  
}


module.exports.createCollective = createCollective
module.exports.createPoints = createPoints
module.exports.readCollective = readCollective
module.exports.updateCollective = updateCollective
module.exports.getTotalUsers = getTotalUsers
module.exports.calculateIntelligence = calculateIntelligence


// dbConnection();