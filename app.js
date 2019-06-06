const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const port = Number(process.env.PORT || '3000'); //added
const http = require('http'); //added
const mongoose = require('mongoose'); //added
const bodyParser = require('body-parser'); //added
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
//support parsing of application/json type post data
app.use(bodyParser.urlencoded({ extended: true }));
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.json());

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var modelDb = require("./public/models/mdb");
var db = mongoose.connect('mongodb://localhost:27017/crudDemo',{useNewUrlParser:true});

app.get('/', function(req,res){
	res.sendFile("./public/index.html"); 
});

//-------Create/Add value-------
app.post('/api/addValue', function(req, res) {
    console.log("In server api");
    console.log("values:" + req.body);
    var modelVarObj = new modelDb();
    modelVarObj.productName = req.body.item;
    modelVarObj.save((err)=>{
        res.send(modelVarObj);
     	console.log("ADDED");
	});
});


//-------Read/Show value-------
app.get('/api/showData', function(req, res) {
    modelDb.find(function(err, data) {
    //if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err){
            res.send(err)
        } else {
            console.log(data);
            res.json(data); //return all items in JSON format
        }
    });
});


//-------Update value-------
app.post('/api/updateValue',function(req,res){
    console.log("In Server Update");
    console.log("Old Value:" + req.body.oldProductName);
    console.log("New Value:" + req.body.newProductName);
    modelDb.update( {"productName": req.body.oldProductName },{ $set:{"productName": req.body.newProductName} },function (err, docs) {
        if (err){
            res.status(500).json(err);
        } else if (docs){
            console.log(docs);
            console.log("Updated successfully");
            res.status(200).json(docs);
        }
    }); 
});


//-------Delete/Remove value-------
app.post('/api/removeValue',function(req,res){
	console.log("In Server Remove");
	console.log("values:" + req.body.productName);
    modelDb.remove( {"productName": req.body.productName },function (err, docs) {
        if (err){
            res.status(500).json(err);
        } else if (docs){
            console.log(docs);
            console.log("Deleted successfully");
            res.status(200).json(docs);
        }

    });	
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = http.createServer(app).listen(port,function(){ //added
    console.log("server listening at "+port);
});

module.exports = app;
