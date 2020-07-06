/* 
    author: Ka-son Chau
    what: Methods to fetch game schedules objects from the database
*/
const NHLDaySchedule = require('../models/nhlScheduleGames');
const NBADaySchedule = require('../models/nbaScheduleGames');
const MLBDaySchedule = require('../models/mlbScheduleGames');

const fetchDailyGamesFromDB = async (searchDate)=>{
    const filterDate = {date:searchDate};
    toReturn = [];
    await NHLDaySchedule.findOne(filterDate,(err,foundGame)=>{
        if(err) console.log(err);
    }).then((response)=>{toReturn.push(response);})
    await NBADaySchedule.findOne(filterDate,(err,foundGame)=>{
        if(err) console.log(err);
    }).then((response)=>{toReturn.push(response);})
    await MLBDaySchedule.findOne(filterDate,(err,foundGame)=>{
        if(err) console.log(err);
    }).then((response)=>{toReturn.push(response);})
    return toReturn;
}

exports.fetchDailyGamesFromDB = fetchDailyGamesFromDB;