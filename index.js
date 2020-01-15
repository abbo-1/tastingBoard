const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const models = require('./models');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const promise = require('bluebird');


// PG-PROMISE INIT OPTIONS
const initOptions = {
    promiseLib: promise,
};

// CONNECTING TO LOCAL DATABASE
const config = {
    host: 'localhost',
    port: 5432,
    database: 'tastingBoard',
    user: 'postgres',
    username: 'postgres',
    password: 'admin'
};

const pgp = require('pg-promise')(initOptions);
const db = pgp(config);

const initalizePassport = require('./passport-config')
initalizePassport (
    passport,
    email =>
        users.find(user => users.email === inputEmail),
    id => 
        users.find(user => users.password === inputPassword)
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(session({
    secret: 'redwine',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');

/////////////////LOGIN PAGE///////////////////

app.get('/index', (req, res) => {
    res.render('index.ejs')
})

/////////////////REGISTER PAGE///////////////////

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', function (req, res) {
    models.user.create({
        email: req.body.inputEmail,
        password: req.body.inputPassword
    })
    .then(function (user) {
        console.log(user)
    });
});
    // try {
    //     const hashedPassword = await bcrypt.hash(req.body.inputPassword, 10)
    //     users.push({
    //         email: req.body.inputEmail,
    //         password: hashedPassword
    //     })
    //     res.redirect('/login')
    // } 
    // catch {
    //     res.redirect('/register')

////////////////////////////////////

app.post('/index', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/index'
}));

////////////////SHOULD DIRECT TO HOMEPAGE AFTER LOGIN////////////////////

app.get("/welcome", checkAuthenticated, function (req, response) {
    console.log('Im here');
    response.send("new item");
});

////////////////SHOULD DIRECT TO REGISTRATION PAGE////////////////////

app.get("/register", checkNotAuthenticated, function (req, response) {
    console.log('Im here');
    response.send("new item");
    res.render('register') 
});

////////////////LOG OUT REDIRECT//////////////////////

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

//////////////////////////////////////

app.post("/drinks", function (req, response) {
    console.log('Im here');
    response.send("another item"); 
});

////////////////////////////////////////

app.put("/drinks", function (req, response) {
    console.log('Im here');
    response.send("a third item");
});

// DELETE single owner
app.delete("/drinks", function (req, response) {
    console.log('Im here');
    response.send("item deleted");
});


// THIS FUNCTION CHECKS FOR AUTHENTICATION
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

// THIS FUNCTION KEEPS AUTHENTICATED USERS FROM GOING TO PAGES THEY DONT NEED TO
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/')
}

app.listen(8080, function () {
    console.log('Tasting Board app listening on port 8080!');
})