module.exports = function(app, passport, db, ObjectID) {

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

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

// API ===============================================================
  app.get('/api/:name',(request,response)=>{
  const focus = request.params.name.toLowerCase()
  if(bodyfocus[focus] ){
    let instructions = bodyfocus[focus]
      response.json(instructions)
  }else{
      response.json(bodyfocus['unknown'])
  }
  
  })

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('appointments').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            appointments: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/demoday/bodyfocus', (req, res) => {
      db.collection('bodyfocus').save({'body part': req.body.focus}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.put('/appointments', (req, res) => {
      db.collection('appointments')
      .findOneAndUpdate({_id: new ObjectID(req.body.id)}, {
        $set: {
          name: req.body.name, 
          reason: req.body.reason, 
          date: req.body.date
        }
        
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.delete('/appointments', (req, res) => {
      db.collection('appointments').findOneAndDelete({name: req.body.name, reason: req.body.reason}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        let user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
