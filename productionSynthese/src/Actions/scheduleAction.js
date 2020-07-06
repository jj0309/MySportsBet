const dateManip = require('../utils/dateManip');
const fetchScheduleFromDB = require('../DAO/DAOutils/fetchScheduleFromDB');


const scheduleData= async ()=>{
    const rawDate = new Date();
    const dateFilter = dateManip.getFormatedDate(rawDate);
    let toReturn = {};
    await fetchScheduleFromDB.fetchDailyGamesFromDB(dateFilter).then((response)=>{toReturn = response;});
    return toReturn;
}

exports.scheduleData = scheduleData;