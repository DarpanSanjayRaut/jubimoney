var express = require('express');
var app =express()
var http = require('http').Server(app);
var request = require('request');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(jsonParser);
app.use(urlencodedParser);
app.use(express.static(__dirname + '/static'));
const headers = { 'User-Agent':'Super Agent/0.0.1', 'Content-Type':'application/json' };

app.get('/report', function(req, res){
  res.sendFile(__dirname + '/report.html');
});

app.post('/data', async function(req, res){
  console.log(req.body.id)
  try {
	  var result = await getTagsBySenderId(req.body.id)
	  res.send({status : 'success', data : result});
  } catch(e) {
  	console.log(e)
 	res.send({status : 'failed'});
  }
});


function getTagsBySenderId(id) {
	console.log(id)
	return new Promise(async (resolve, reject)=>{
		try {

		    request({
		      url:"https://jubimoney.com/jubimoney/getUserTags", 
		      method:"POST",
		      headers:headers,
		      body:JSON.stringify({"sender":id},null,3)
		      }, (err,resp,body)=>{
		        console.log(err+body)
		        return resolve(body)
		    });			
		} catch(e) {
			console.log(e)
			return reject(e)
		}
	})
}

http.listen(9898 , function(){
  console.log('listening on :80');
});


let english = {
	title : 'Your JubiMoney report',
	
}

