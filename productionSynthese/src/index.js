/*
    fichier principale du app
*/
require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser');

const app = express();
const port = 80;
const publicPath = path.join(__dirname+"/../public/");

//connection to our mongoose database
require("./DAO/db/connectionMongoose");
// pour set le dossier public et set le view engine a ejs
app.use("/public",express.static(publicPath));
app.set('view engine','ejs');

//to parse incoming request data into json obj
app.use(express.json());
//to get query parameter from requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// for cookies
app.use(cookieParser());

// imports des routes
const registerRoute = require('./routes/register');
const miseRoute = require('./routes/mise');
const monCompteRoute = require('./routes/monCompte');
const addBalance = require('./routes/addBalance');
const page404 = require('./routes/page404');
const aboutRoutes = require('./routes/about');
const scheduleRoute = require('./routes/schedule');
const logInRoute = require('./routes/logIn');
const indexRoute = require('./routes/index');
const logoutRoute = require('./routes/logout');
// routes
app.use("/register",registerRoute);
app.use("/mise",miseRoute);
app.use("/moncompte",monCompteRoute);
app.use("/ajouterfond",addBalance);
app.use("/about",aboutRoutes);
app.use("/login",logInRoute);
app.use("/schedule",scheduleRoute);
app.use("/logout",logoutRoute);
// index
app.use('/',indexRoute);

app.use("/*",page404);

console.log("port "+port);
app.listen(port);