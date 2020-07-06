const express = require('express');
const router = express.Router();
const authenticateUtil = require('../utils/authenticateToken');
const createLocalObj = require('../utils/navbarData');

router.get('/',authenticateUtil.authenticateToken,async(req,res)=>{
    data={ userData :"" };
    data["userData"] = await createLocalObj.createLocalObj(data,req.user);
    res.render("../public/about.ejs",data);
})
module.exports = router;