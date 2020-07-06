const express = require('express');
const router = express.Router();
const authenticateUtil = require('../utils/authenticateToken');
const createLocalObj = require('../utils/navbarData');

router.get('/',authenticateUtil.authenticateToken,async(req,res)=>{
    data={ userData :"" };
    data.userData = await createLocalObj.createLocalObj(data,req.user);
    if(!data.userData)
        return res.render("../public/login.ejs",data);
    res.render("../public/monCompte.ejs",data);
});

module.exports = router;