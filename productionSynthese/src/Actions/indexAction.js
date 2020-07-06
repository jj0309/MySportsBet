const fetchMSF = require('../utils/fetchMSF');
const scheduleUtil = require('../utils/schedule/seperateSchedule');

/*
    ---------------------returnedData METHOD-------------------------
    *****************************************************************
    *****************************************************************
    **NOTE: NO LONGER USED SINCE WE HAVE EVERYTHING IN OUR DATABASE**
    *****************************************************************
    *****************************************************************
    METHOD THAT RETURNS THE DATA OF FETCHED FROM MYSPORTSFEED BACK TO OUR INDEX PAGE
*/
const returnedData = async() =>{
    const dailyGamesURL = "https://api.mysportsfeeds.com/v2.1/pull/nhl/2019-2020-regular/date/20200210/games.json";
    let fetched = null;
    try{
        fetched = await fetchMSF.fetchData(dailyGamesURL);
    }catch(e){
        console.log(e);
    }
    return fetched;
}

/*
    PARAM: OBJECT FETCHED FROM THE DB USING THE DATE THAT CONTAINS ALL THE GAMES FOR TODAY
    RETURNS THE DATAS WE'RE GONNA USE IN THE INDEX TO SHOW THE SCHEDULE
*/
const filterData = (dailyGameObject) =>{
    return scheduleUtil.seperateData(dailyGameObject);
}

exports.returnedData = returnedData;
exports.filterData = filterData;
