'use strict'
function dataAccessFunction (model, callback) {
  if (model) {
    if (model.dbOpsType) {
      switch (model.dbOpsType) {
        case 'create' : listenerCreate(model, callback)
          break

        case 'delete' : listenerDelete(model, callback)
          break
        case 'read' : listenerReadByFilter(model, callback)
          break
        case 'update' : listenerUpdate(model, callback)
          break
        case 'count' : listenerCount(model, callback)
          break
        case 'singleupsert' : listenerSingleUpsert(model, callback)
        break
        case 'readById' : listenerReadById(model, callback)
        break
        case 'sort' : listenerSort(model, callback)
        break
        default : callback('Wrong Operation Type : Supported types are create , read , update and delete.')
      }
    } else {
      callback('Model dbOps type undefined.')
    }
  } else {
    callback('Model undefined.')
  }
}
// Sort docs as per feild 
function listenerSort(model, callback) {
  if (typeof model.schema === 'function' && typeof model.readLimit === 'number' && typeof model.offset === 'number') {
    // model.schema.find(model.findBy).sort(model.sortBy).exec(callback)
     model.schema.find(model.findBy).sort(model.sortBy).limit(200).exec(callback)
  } else {
    callback('Model data incomplete.')
  }
}

// function to create a new document
function listenerCreate (model, callback) {
  if (typeof model.schema === 'function' && typeof model.data === 'object') {
    new model.schema(model.data).save(callback)
  } else {
    callback('Model data incomplete.')
  }
}

// function to delete a document by id
function listenerDelete (model, callback) {
  if (typeof model.schema === 'function' && model.id) {
    model.schema.findByIdAndRemove(model.id,callback)
  } else {
    callback('Model data incomplete.')
  }
}

// function to read by given data
function listenerCount(model, callback) {
  if (typeof model.schema === 'function') {
    model.schema.count(model.data, callback)
  } else {
    callback('Model data incomplete.')
  }
}


// function to read by given data
function listenerReadByFilter (model, callback) {
  if (typeof model.schema === 'function' && typeof model.readLimit === 'number' && typeof model.offset === 'number') {
    // console.log(model.data)
    model.schema.find(model.data, callback).limit(model.readLimit).skip(model.offset)
  } else {
    callback('Model data incomplete.')
  }
}

// function to read by document id
function listenerReadById (model, callback) {
  if (typeof model.schema === 'function' && model.id) {
    model.schema.findById(model.id, callback)
  } else {
    callback('Model data incomplete.')
  }
}

// function to update document
function listenerUpdate (model, callback) {
  if (typeof model.schema === 'function' && typeof model.data === 'object' && model.id) {
    model.schema.findByIdAndUpdate(model.id, {$set: model.data}, callback)
  } else {
    callback('Model data incomplete.')
  }
}

function listenerSingleUpsert (model, callback) {
  // console.log("DATA :::::::::::::::" + JSON.stringify(model, null, 3))
  if (typeof model.schema === 'function' && typeof model.record === 'object') {
      let schema = model.schema;
      let record = model.record;

      if(!model.matchKey) {
        callback('match key not found for query')
      }

      var bulk = schema.collection.initializeUnorderedBulkOp();
      var query = { };
      // console.log(JSON.stringify(model, null, 3)+ "********QYERTYY")
      query[model.matchKey] = record[model.matchKey];
      // console.log(JSON.stringify(query, null, 3) + "query to find:::" + model.matchKey + "---" + query[model.matchKey])
      bulk.find(query).upsert().updateOne(record);
      
      bulk.execute(function(err, bulkres){
          if (err) {
            console.log("error upsert")
            return callback(err, null); 
          }
          console.log("success upsert")
          callback(null, bulkres);
      });
  } else {
    callback('Model data incomplete.')
  }
}
// exports
module.exports = dataAccessFunction
