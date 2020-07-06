const express = require('express');
const router = express.Router();
const authenticateUtil = require('../utils/authenticateToken');
const user = require('../DAO/models/user');
const createLocalObj = require('../utils/navbarData');

router.get('/',authenticateUtil.authenticateToken,async(req,res)=>{
    data={
        userData : "",
        inPost : false,
    };
    data.userData = await createLocalObj.createLocalObj(data,req.user);
    if(!data.userData)
        return res.render("../public/login.ejs",data);
    res.render("../public/addBalance.ejs",data);
})

router.post('/', authenticateUtil.authenticateToken,async (req,res)=>{
    /* 
        updates the balance of the user if found
     */
    // mongoose deprecation warning is set to false in DAO/db/connectionMongoose.js
    const addAmount = req.body.amount;
    const username = req.user.username;
    const filter = {username:username};
    let currentBalance = 0;
    await user.findOne(filter,(err,foundUser)=>{
        if(err)
            return res.status(404).send(err);
        currentBalance = foundUser.balance + parseInt(addAmount);
    });
    const updateOBJ = {
        balance:currentBalance,
    };
    let status = {
        transaction :false,
        inPost : true,
        userData : "",
        userBalance:updateOBJ.balance
    };
    await user.findOneAndUpdate(filter,updateOBJ,(err)=>{
        if(err == undefined)
            status.transaction = true;
    });
    status.userData = await createLocalObj.createLocalObj(data,req.user);
    res.render("../public/addBalance.ejs",status);
})

module.exports = router;