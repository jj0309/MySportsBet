const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.cookie('yourPersonalCookie',"");
    data={ userData :"" };
    res.render("../public/logout.ejs",data);
});

module.exports = router;