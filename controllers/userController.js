const User = require("../models/User");
const bcrypt = require('bcrypt');
const validator = require('validator');

module.exports=function(app){

app.get("/login", (req, res) => {
        res.render("login.ejs");
});

app.get("/register", (req, res) => {
        res.render("register.ejs");
});

//POST METHOD

app.post('/register', async (req, res, next) => {

    try {
        const email = req.body.email;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        if (validator.isEmpty(email) || validator.isEmpty(password) || validator.isEmpty(confirmPassword)) {
            let error = toastr.error("Please fill all the fields!");
            res.status(480).json(error);
        }

        if (validator.isEmail(email) === false) {
            let error = "Please enter a valid email!";
            res.status(480).json(error);
            return;
        }

        if (!validator.equals(password, confirmPassword)) {
            let error = "Confirmation does not match password!";
            res.status(480).json(error);
            return;
        }

        let hash = bcrypt.hashSync(password, 10);

        let userExists = await User.find({
            email
        });

        if (userExists.length > 0) {
            res.status(480).json('User exists');
            return;
        }

        // Try catch mongoose exception

        try {
            
            let user= await User({email:req.body.email, password:hash}).save();
            res.status(200).json('User Created');
        } catch (err) {
            console.log(err);
            res.status(480).json('Unable to create user');
        }


    } catch (err) {
        res.status(480).json('Server error');
    }
});

app.post('/login', async (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    let mongoResult = await User.find({
        email
    });

    if(mongoResult.length === 0){
        res.status(480).json('Wrong user credentials');
        return;
    }

    const user = mongoResult[0];

    const match = await bcrypt.compare(password, user.password);

    if(match) {

        // Hash match for the current user

        req.session.loggedin = true;
        req.session.userid = user._id;

        res.status(200).json('User session created');
        return;
    }

    res.status(480).json('Wrong user credentials');

});

app.get("/logout", (req, res) => {
    // Destroy user session
    req.session.destroy();

    res.redirect("/");
});

app.get("/session" , (req , res) => {
   console.log(req.session);
});

};