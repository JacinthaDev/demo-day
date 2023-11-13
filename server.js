//module.exports = function(app, passport, db, ObjectID) {

  //API     ===============================================================
  
  const express = require('express')
  const mongoose = require('mongoose');
  const app = express()
  const cors = require('cors')
  const PORT = 8000
  const { ObjectID } = require('mongodb');

  
  const passport = require('passport');
  app.use(passport.initialize());
  require('dotenv').config();

  //let id = new ObjectID(stringId);

  
  let db
  let url= process.env.dbString
  let dbName = "demoday"
  let collection;
  
  
  // configuration ===============================================================
  mongoose.connect(url, (err, database) => {
    if (err) return console.log(err)
    db = database
    //require('./app/routes.js')(app, passport, db, ObjectID);
  }); // connect to our database

  
  const bodyfocus = {
    'shoulder': {
        'standing arm swings': {
          "instructions": "Stand tall with your arms by your sides. Engage your core and swing your arms forward until they’re as high as you can go. Make sure you don’t raise your shoulders. Return your arms to the starting position and repeat. Do this movement for 30 to 60 seconds."
        },
        'shoulder pass-through': {
            "instructions": "Stand with your feet shoulder-width apart and your arms in front of your body. Hold a stick, like a broomstick or PVC pipe, with an overhand grip. Your arms will be wider than shoulder-width. Make sure the stick or pipe is parallel to the floor. Engage your core and slowly raise the broomstick or pipe above your head, keeping your arms straight. Only go as far as comfortable. Hold the pose for a few seconds. Return to the starting position. Repeat 5 times."
          }, 
        'doorway stretch': {
          "instructions": "Stand in a doorway with elbows and arms forming a 90-degree angle. Your feet should be in a split stance. Bring your right arm up to shoulder height and place your palm and forearm on the doorway. Gently lean into the stretch, only going as far as comfortable. Hold the stretch for up to 30 seconds. Change sides and repeat. Perform on each side 2–3 times."
        }
    },
    'neck':{
        'neck rotation': {
          'instructions': "Rotate head gently and slowly from side to side. Do not turn head completely to either side, keep motion small. Keep chin level with ground without letting chin drop to chest. Repeat 10 times. Perform this exercise 2 times per day."
        },
        'upper trapezius stretch': {
          'instructions': "Sit up tall with good posture keeping shoulders down. Grasp the bottom of the seat with one hand. Slightly turn your ear to your shoulder until a comfortable stretch is felt on the opposite side of the neck. Hold that position for 20 seconds. Repeat to each side 3 times. Perform this exercise 2 times per day."
        },
        'levator scapula stretch': {
          "instructions" : 'Sit up tall with good posture keeping shoulders down. Grasp the bottom of the seat with one hand. Slightly turn your chin toward your armpit until a comfortable stretch is felt on the opposite side of the neck. Hold that position for 20 seconds. Repeat to each side 3 times. Perform this exercise 2 times per day.'
      }
  },
    'back':{
        'standing repeated lumbar extensions': {
          'instructions': "From a standing position, place your hands on your hips. Slowly and with control, lean your trunk backward to the first point of stiffness or pain, then return to an upright position. Pay attention to keeping your balance throughout the stretch. Knees should remain straight."},
        'seated figure four stretch': {
          'instructions': "While sitting upright in your chair with feet on the ground, lift one foot and bring it to rest on the opposite knee. Lean forward gently until you feel the stretch. Keep your back straight and hold this position."
        },
        'chair-edge hamstring stretch': {
          'instructions': "Begin seated on the edge of your chair with one foot on the ground while bringing the other straight forward in front of you, heel resting on the ground. Hinge at the hips and lean forward until you feel the stretch, then hold the position. Keep your back and extended knee straight throughout, then switch legs."
        }
  }, 
    'unknown': {
        'continent': 'unknown',
        'language': 'unknown',
        'currency': 'unknown'
    }
  }
  
  
  app.get('/', (request, response)=>{
      response.sendFile(__dirname + '/views' + '/homepage.html')
  })
  
  app.get('/main.js', (request, response)=>{
      response.sendFile(__dirname + '/public' + '/main.js')
  })
  
  app.get('/api/:name',(request,response)=>{
    const focus = request.params.name.toLowerCase()
    if(bodyfocus[focus] ){
        response.json(bodyfocus[focus])
    }else{
        response.json(bodyfocus['unknown'])
    }
    
  })

  app.post('/demoday/bodyfocus', (req, res) => {
  db.collection('bodyfocus').save({'body part': req.body.focus}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/profile')
  })
  })
  
  app.listen(process.env.PORT || PORT, ()=>{
      console.log(`The server is now running on port ${PORT}! Betta Go Catch It!`)
  })
  

  
  
//}



// // server.js

// // set up ======================================================================
// // get all the tools we need
// const express  = require('express');
// const app      = express();
// const port     = process.env.PORT || 8080;
// const MongoClient = require('mongodb').MongoClient
// const ObjectID = require('mongodb').ObjectID
// const mongoose = require('mongoose');
// const passport = require('passport');
// const flash    = require('connect-flash');
// const path = require('path');

// const morgan       = require('morgan');
// const cookieParser = require('cookie-parser');
// const bodyParser   = require('body-parser');
// const session      = require('express-session');
// require('dotenv').config();

// let db
// let url= process.env.dbString
// let dbName = "demoday"
// let collection;


// // configuration ===============================================================
// mongoose.connect(url, (err, database) => {
//   if (err) return console.log(err)
//   db = database
//   require('./app/routes.js')(app, passport, db, ObjectID);
// }); // connect to our database

// require('./config/passport')(passport); // pass passport for configuration

// // set up our express application
// app.use(morgan('dev')); // log every request to the console
// app.use(cookieParser()); // read cookies (needed for auth)
// app.use(bodyParser.json()); // get information from html forms
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// //app.use(express.static('public'))




// // required for passport
// app.use(session({
//     secret: 'rcbootcamp2021b', // session secret
//     resave: true,
//     saveUninitialized: true
// }));
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions
// app.use(flash()); // use connect-flash for flash messages stored in session


// // launch ======================================================================
// app.listen(port);
// console.log('The magic happens on port ' + port);


