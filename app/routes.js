module.exports = function(app, passport, db, multer, ObjectId) {

// Image Upload Code =========================================================================
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + ".png")
    }
});
var upload = multer({storage: storage});


// normal routes ===============================================================

// show the home page (will also have our login links)
app.get('/', function(req, res) {
    res.render('index.ejs');
});


// PROFILE SECTION =========================
app.get('/profile', isLoggedIn, function(req, res) {
    let uId = ObjectId(req.session.passport.user)
    db.collection('posts').find({'posterId': uId}).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user : req.user,
        posts: result
      })
    })
});


//Create Post =========================================================================
app.post('/qpPost', upload.single('file-to-upload'), (req, res, next) => {
  let uId = ObjectId(req.session.passport.user)
  db.collection('posts').save({posterId: uId,
    caption: req.body.caption, likes: 0,
     imageURL: req.body.imageURL,
     username: req.body.username,
      chartSymbol:req.body.chartSymbol,
      position:req.body.position,

       entry:req.body.entry,
       stoploss:req.body.stoploss,
        takeprofit:req.body.takeprofit,
        status: req.body.status,
        winStatus: req.body.winStatus,
         entryCond1:req.body.entryCond1,
         entryCond2:req.body.entryCond2,
         entryCond3:req.body.entryCond3,
         entryCond4:req.body.entryCond4,
         risk: Math.abs( parseFloat(req.body.stoploss) - parseFloat(req.body.entry)).toFixed(2),
         reward: Math.abs( parseFloat(req.body.entry) - parseFloat(req.body.takeprofit)).toFixed(2),
         riskReward: Math.abs((Math.abs( parseFloat(req.body.stoploss) - parseFloat(req.body.entry)))/( Math.abs( parseFloat(req.body.entry) - parseFloat(req.body.takeprofit)))).toFixed(2),
         imgPath: 'images/uploads/' + req.file.filename}, (err, result) => { // WHERE IS GETTING THESE NUMBERS
         // // this is reffering the the posts collection, when a file is upload in the profile.ejs there is a form with a method /qpPost on line 50
         // when it does save a singular form into the database, the information its taken is as follows:
         // // // (a) the current userId in sesstion (b) the body.caption of the form is saved (c) the file. path of whatever the particular file is, actually ends up being saved
           if (err) return console.log(err)
           console.log('saved to database')
           res.redirect('/profile') // redirect method can be applied once the sumbit button is hit
         })
         });




// FEED PAGE =========================
app.get('/feed', function(req, res) {
    db.collection('posts').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('feed.ejs', {
        user : req.user,
        posts: result
      })
    })
});

app.get('/learn', function(req, res) {
    db.collection('posts').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('learn.ejs', {
        user : req.user,
        posts: result
      })
    })
});

// INDIVIDUAL POST PAGE =========================
app.get('/post/:zebra', function(req, res) {
    let postId = ObjectId(req.params.zebra)
    console.log(postId);
    db.collection('posts').find({_id: postId}).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('post.ejs', {
        posts: result,

      })
    })
});


app.delete('/delete', (req, res) => {
  db.collection('posts').findOneAndDelete({imgPath: req.body.imgPath}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})


app.get('/stats',isLoggedIn,function (req,res){
  let uId = ObjectId(req.session.passport.user)
  var userCollection = db.collection('posts').find({'posterId': uId}).toArray((err,result) => {
    let test= Array.from(result);
    let avgRatioArr=[];
    let avgRiskArr=[];
    let avgRewardArr=[];
    let winCount=0;
    let breakevenCount=0;
    let lossCount=0;


    for(let i=0;i<test.length;i++){
      avgRatioArr.push(parseFloat(test[i].riskReward))
      avgRiskArr.push(parseFloat(test[i].risk))
      avgRewardArr.push(parseFloat(test[i].reward))
      if(test[i].winStatus === "WIN"){
        winCount++
      }if( test[i].winStatus === "LOSS"){
        lossCount++
      }if ( test[i].winStatus === "BREAKEVEN" ){
        breakevenCount++
      }
    }
    let sum = avgRatioArr.reduce((a,b) => a + b);
    let sum1 = avgRiskArr.reduce((a,b) => a + b);
    let sum2 = avgRewardArr.reduce((a,b) => a + b);


    let actualAvgRisk = sum1/(test.length);
    let actualAvgRatio = sum/(test.length);
    let actualAvgReward = sum2/(test.length);
    let msg =` Let's keep up the work. Now that you have progress in Risk Management, let's work on scaling. `



    if(err) return console.log(err)
    if(result) res.render('stats.ejs',{
      user: req.user,
      avgRatio: actualAvgRatio,
      avgRisk : actualAvgRisk,
      avgReward: actualAvgReward,
      winTally: winCount,
      lossTally: lossCount,
      breakevenTally: breakevenCount,
      message : msg,



    })
  });

})
// LOGOUT ==============================
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

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
        var user            = req.user;
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
