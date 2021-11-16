const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

bodyParser = require("body-parser");

const taskController=require('./controllers/taskController')
const userController=require('./controllers/userController')
const entryController=require('./controllers/entryController')

// Get the data from the env file
dotenv.config();

// Set public path and the query url parser
app.use("/assets", express.static(__dirname + "/public"));
app.use(express.urlencoded({extended: true}));

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true}, () => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
});

app.set("view engine", "ejs");


// Set body parser to json mode
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: true,
    saveUninitialized: true
}));

app.use(function(req, res, next) {

    // Global restrict app middleware

    let allowedRotues = ['/login' , '/register' , '/session'];

    if (req.session.userid === undefined && !allowedRotues.includes(req.path)) {
        // redirect user to login if no session has been stored
        res.redirect('/login');
    }else{
        next();
    }

});


taskController(app);
userController(app);
entryController(app);






