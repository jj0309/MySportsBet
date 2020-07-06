const express = require('express');
const router = express.Router();
const user = require('../DAO/models/user');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const authenticateUtil = require('../utils/authenticateToken');
const createLocalObj = require('../utils/navbarData');

router.get('/',authenticateUtil.authenticateToken,async (req,res)=>{
    data={ userData :"" };
    data = await createLocalObj.createLocalObj(data,req.user);
    res.render('../public/login.ejs',data);
});

router.post('/',async (req,res)=>{
    utilisateur = new user(req.body);
    let generatedCookie = false;
    let accessToken = null;
    if(!req.body["username"]){
        return res.render("../public/login.ejs");
    }
    await user.findOne({username:req.body["username"]},async function(err,foundUser){
        if(err) return res.status(404).render();

        if(foundUser){
            await bcrypt.compare(req.body["password"],foundUser.password,function(err,res){
                if(err) return res.status(400).send(err);
                if(res){
                    userToken = {
                        username: foundUser.username,
                        firstName:foundUser.firstName,
                        lastName:foundUser.lastName,
                        userEmail:foundUser.email,
                        power: "member"
                    }
                    accessToken = jwt.sign(userToken,process.env.ACCESS_TOKEN_SECRET);
                    generatedCookie=true;
                }
            })
        }
    });
    if(generatedCookie)
        res.cookie('yourPersonalCookie',accessToken);
    res.redirect('/login');
})

module.exports = router;