//modules
const User = require("./model/designmodel")
require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const ejs = require('ejs')
const uuid =  require('uuid')
const axios = require('axios');
const Design = require('./model/designmodel')
//const User = require('./models/usermodel')
var validator = require('validator');
const server = require('http').createServer(app);
const io = require("socket.io")(server,{cors: {origin:"*"}});

//middlewareS
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')
const xss = require('xss-clean')

// setting view engine to ejs
app.set('view engine', 'ejs')

//database configure ("monodb/mongoose")
const mongoose = require('mongoose')
const dbname = "phonecases"
const dburl = "mongodb+srv://Avin:avin@cluster0.ayk9r.mongodb.net/"



mongoose.connect(dburl+dbname,
{useNewUrlParser: true},
{useCreateIndex :true},
{strictQuery : true}
).then(()=>{
    console.log("connected to database")
})


//multer
var fs = require('fs');
var path = require('path');
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/pic'); // 'public' is the root directory, 'pic' is the subdirectory
  },
  filename: (req, file, cb) => {
      const uniqueFileName = `${uuid.v4()}${path.extname(file.originalname)}`;
      cb(null, uniqueFileName);
  }
});


const upload = multer({ storage: storage });
 module.exports = upload



//using middlewares
//app.use(helmet())
app.use(mongoSanitize())
app.use(hpp())
app.use(xss())
app.use(express.static("public"));
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));


//using limiter to limit usages

const limiter = rateLimit({
  max : 100 ,
  windows : 60*60*1000,
  message : "crossed the limit"
})
app.use('/',limiter)

//Routes handler
const home = require('./routes/home')
const cart = require('./routes/cart')
const phones = require('./routes/phones')
const admin = require('./routes/admin')
/*
const authenticateing = require('./routes/authenticate')
const profile = require('./routes/profile')
const userauth = require('./routes/userauth')

*/
//using routes middleware
app.use('/',home )
app.use('/phonecases',phones)
app.use('/cart',cart)
app.use('/admin' , admin)
/*
app.use('/authenticate',authenticateing)
app.use('/profile',profile)
app.use('/user' , userauth)

*/


app.post('/upload', upload.single('design_image'), (req, res) => {
  if (req.file) {
      const design_name = req.body.design_name;
      const category = req.body.category;
      const design_image = req.file.filename;

      if (!design_name) {
          return res.status(400).send('Design name is required.');
      }

      const newDesign = new Design({
          design_name,
          category,
          design_image,
      });

      newDesign.save()
          .then(() => {
              res.send('Design uploaded and saved to the database.');
          })
          .catch(err => {
              res.status(500).send(err);
          });
  } else {
      res.send('No image selected.');
  }
});




app.all('*', (req,res,next)=>{
    res.render('pagenotfound')
    next();
})



module.exports =  app



