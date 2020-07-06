const express = require('express');
const router = express.Router();
const authenticateUtil = require('../utils/authenticateToken');
const dailyGameData = require('../Actions/indexAction');
const createLocalObj = require('../utils/navbarData');
const scheduleAction = require('../Actions/scheduleAction'); // to fetch the datas from the DB

router.get("/",authenticateUtil.authenticateToken, async(req,res)=>{
    let filteredDataList = null;
    const fetchData = async ()=>{
        const dailyGamesObject = await scheduleAction.scheduleData();
        return dailyGameData.filterData(dailyGamesObject);
    }
    filteredDataList = await fetchData();
    data = {
        data : filteredDataList,
        userData:""
    };
    data.userData = await createLocalObj.createLocalObj(data,req.user);
    res.render("../public/index.ejs",data);
});

module.exports = router;
