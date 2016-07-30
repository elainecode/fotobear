var express = require('express');
var morgan = require('morgan');
var passport = require('passport');
var path = require('path');
var port = process.env.PORT || 3000;
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');



var app = express();

var uri = 'mongodb://angryphantom:purse@ds031995.mlab.com:31995/fotobear';
mongoose.connect(uri, function() {
    console.log("mongoose is plugged in");
});


app.use(express.static(__dirname + "/public"));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


app.use(morgan('dev'));

app.use(session({
    secret: 'kellovesorangesoda',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());



// required files
var Post = require('./server-assets/postmodel.js');
var User = require('./server-assets/usermodel.js');
require('./server-assets/passport.js')(passport);



// Routes


//POST /signup -  register user 

app.post('/signup', function(req, res) {
    if (!req.body) {
        return res.status(501).send('is not complete');
    };
    var user = new User({
        username: req.body.username,
        password: req.body.password
    });
    user.save(function(err) {
        if (err) {
            return res.status(501).
            send('cannot be saved');
        }
        return res.status(200).send('A-Ok!');
    });

});


//GET /login    - authenticate user 

app.post('/login', passport.authenticate('local', {}),
    function(req, res) {
        return res.status(200).send('A-Ok!');
    });



//GET /logout  - log user out

app.get('/logout', function(req, res) {
    req.logout();
    return res.send('You are now logged out!');
});


//route middleware to make sure user logged in

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        console.log(" True ");
        return next();
    }
    return res.status(500).send("Please login");
};

//GET /username  - retrieve username from server

app.get('/username', isLoggedIn,
    function(req, res) {
        return res.status(200).send(req.user.username);
    });


//GET /posts - return a list of posts and associated metadata

app.get('/posts', function(req, res, next) {
    Post.find(function(err, posts) {
        if (err) {
            return next(err);
        }
        res.status(200).json(posts);

    });
});

//POST /posts - create a new post

app.post('/posts', function(req, res) {
    if (!req.body) {
        return res.status(400).send('incomplete post');
    };

    var post = new Post({
        title: req.body.title,
        url: req.body.url,
        likes: req.body.likes
    });

    post.save(function(err, post) {
        if (err) { res.status(501).send('post cannot be saved'); }
        return res.status(201).json(post);
    });
});

//GET /favorites/  - get user favorites array 

app.get('/favorites', isLoggedIn,
    function(req, res) {
        var Id = req.user._id;
        User.find({ _id: Id }).populate('favorites').exec(function(err, result) {
            if (err) return res.status(500).send('user network error');
            res.status(200).json(result[0].favorites);
        });

    });

//PUT /favorites/add  - add post to user favorites array 

app.put('/favorites/add/:id', isLoggedIn,
    function(req, res) {
        var favId = req.params.id;
        var userId = req.user._id;
        User.findById(userId, function(err, user) {
            if (err) {
                return res.status(500).send('user network error')
            };
            if (!user) {
                return res.status(500).send('user network error')
            };
            if (user.favorites.indexOf(favId) !== -1) {
                return res.status(502).send('favorite already added');
            }
            user.favorites = user.favorites.concat(favId);
            user.save(function(err, result) {
                if (err) return res.status(500).send('user network error');
                res.status(200).json(result);
            });

        });
    });

//PUT /favorites/remove  - remove post from user favorites array 

app.put('/favorites/remove/:id', isLoggedIn,
    function(req, res) {
        var userId = req.user._id;
        var favId = req.params.id;

        User.findById(userId, function(err, user) {
            if (err) return res.status(500).send('user network error');
            var index = user.favorites.indexOf(favId);
            if (index === -1) return res.status(501).send('favorite not found');
            user.favorites.splice(index, 1);
            user.save(function(err, result) {
                if (err) return res.status(500).send('user network error');
                res.status(200).json(result);
            });
        });
    });

//PUT /posts/likes  - increment a post likes by + 1 

app.put('/posts/likes/:id', isLoggedIn, function(req, res, next) {
    var postId = req.params.id;

    Post.findById(postId, function(err, post) {
        if (err) return res.status(500).send('user network error');
        if (!post) return res.status(500).send('post not found');
        post.addLikes(function(err, post) {
            if (err) {
                return next(err);
            }
            res.status(200).json(post);
        });

    });
});



app.all('/*', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});


app.listen(port);
console.log('Listening on port 3000');
