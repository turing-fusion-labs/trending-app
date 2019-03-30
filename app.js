//EXpress Config
var express = require('express'),
    app = express(),
    loki = require('lokijs'),
    session = require('express-session'),
    bodyParser = require('body-parser');

//DB config
var db = new loki('trending.db');
var User = db.addCollection('users');
var Item = db.addCollection('items');

User.insert({username:'admin',password:'admin'});
console.log(User);

//EJS
app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({key: 'sid',secret: 'srt', resave: false, saveUninitialized: false}));
app.listen(7000);

// This is example of logging message in the console (black screen)
console.log('Trending app started on http://localhost:7000');

// function to match username and password
function userPasswordMatch (userName, password) {
    var loginUser = User.findOne({username:userName,password:password});
    if (loginUser != null) return true;
    else return false;
}

// load login page
app.get('/', function (request, response) {
    response.render('index', {message: null});
});

// click Welcome on login page
app.post('/login', function (request, response) {
    var loginName = request.body.loginName;
    var password = request.body.password;

    request.session.user = loginName;

    if (userPasswordMatch(loginName, password) == true) {
        var items = Item.find({});
        console.log(items);
        response.render('listpage', {items: items});
    } else {
        response.render('index', {message: "Invalid user name or password"});
    }

});

// load list page
app.get('/login', function (request, response) {
    response.render('listpage', {items: Item.find()});
});

// load list page
app.get('/saveitem', function (request, response) {
    response.render('listpage', {items: Item.find()});
});

// save all information on add page
function saveFormAndReturnAllItems (form) {
    Item.insert(form);
    var allItem = Item.find();
    console.log (allItem);
    return allItem;
}
// ---------- do not change above unless you know what you are doing :) -----------


// when the link Add New Item is clicked
app.get('/additem', function (request, response) {
    response.render('addpage',{loginName:request.session.user, message:null});
});

// when save button is clicked on add page
app.post('/saveitem', function (request, response) {
    var items = saveFormAndReturnAllItems(request.body);
    response.render('listpage',{ items:items });
});
