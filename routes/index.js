var express = require('express');
var router = express.Router();
require("dotenv").config();

const Message = require("../model/message");

const mongoose = require("mongoose");
const uri = process.env.DATABASE_URL;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB DB connection established successfully.")
})

const middleWare = async (req, res, next) => {
  try {
    var query = Message.aggregate([
      { $sort: {time_added: -1}}, 
      { $limit: 10}
    ]);
    const data = await query.exec();
    console.log(data);
    req.messages = data;
    next();
  } catch(err) {
    console.log("err: ", err); 
    next(err);
  }

  /* var query = Message.aggregate([
    { $sort: {time_added: -1}}, 
    { $limit: 10}
  ]).then((data) => {
    console.log(data);
    messages = data;
    next();
  }); */
}

/* GET home page. */
router.get('/', middleWare, function(req, res, next) {
  res.render('index', { title: 'Mini Messageboard', messages: req.messages });
});

router.get('/new', function(req, res, next) {
  res.render('form');
});

router.post('/new', async (req, res) => {
  

  try {
    console.log("req.body: ", req.body);
    const newMsg = new Message({
      user_name: req.body.authorname, 
      message_text: req.body.text,
      time_added: new Date(),
    })
    await Message.create(newMsg);
    console.log("Msg added to DB");
    res.redirect('/');
  } catch(err) {
    console.log("err: ", err)
  }
})

module.exports = router;
