require('dotenv').config();
//server
const express = require('express');
const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/resetUpdatedAt', function (req, res) {
  var mongo = require('mongodb');
  var MongoClient = mongo.MongoClient;
  MongoClient.connect(process.env.ONG_MONGODB_URI, (err, db) => {
    if (err) {
      res.send('db error');
      return false;
    }
    res.send('db ok');
    db.collection('runners').updateMany({},{$set:{updatedAt:new Date().getTime()}});
  });
});
app.get('/runners/:updatedAt', function (req, res) {
  //console.log('here');
  var ret = [];
  runners.find({
    tagId: {
      $nin: ['', null]
    },
    updatedAt: {
      $gte: req.params.updatedAt
    }
  }).select({
    tagId: 1,
    bib_number: 1,
    name_on_bib: 1,
    first_name: 1,
    last_name: 1,
    raceCat: 1,
    updatedAt: 1
  }).sort({
    updatedAt: -1
  }).exec(function (err, result) {
    for (var i in result) {
      ret.push({
        tagId: result[i].tagId * 1,
        bibNo: result[i].bib_number * 1,
        bibName: result[i].name_on_bib,
        name: result[i].first_name + ' ' + result[i].last_name,
        raceCat: result[i].raceCat,
        updatedAt: result[i].updatedAt
      })
    }
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send(ret);
  })
});
app.listen((process.env.PORT || 5000), function () {
  console.log('listening to ' + process.env.PORT);
});
//mongoose
var mongoose = require('mongoose');
mongoose.connect(process.env.ONG_MONGODB_URI, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
var runnersSchema = new mongoose.Schema({
  _id: {
    type: String
  },
  bib_number: {
    type: Number,
    index: true
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  tagId: {
    type: String,
    index: true
  },
  name_on_bib: {
    type: String
  },
  raceCat: {
    type: String
  },
  updatedAt: {
    type: Number,
    index: true
  }
}, {
  _id: false
});
var runners = mongoose.model('runner', runnersSchema);
