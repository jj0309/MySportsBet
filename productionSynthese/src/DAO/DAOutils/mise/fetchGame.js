const NHLDaySchedule = require('../../models/nhlScheduleGames');
const NBADaySchedule = require('../../models/nbaScheduleGames');
const MLBDaySchedule = require('../../models/mlbScheduleGames');

const fetchGameWithID=(gameID)=>{
    let models = [];
    models.push(NHLDaySchedule);
    models.push(NBADaySchedule);
    models.push(MLBDaySchedule);

    return Promise.all(models.map(model=>model.findById(gameID,(err,game)=>{if(err) console.log(err);})))
}

const ifExist=async(gameID)=>{
    let found = false;
    await NHLDaySchedule.countDocuments({_id:gameID},(err,count)=>{
        if(count>0)
            found = true;
    })
    await NBADaySchedule.countDocuments({_id:gameID},(err,count)=>{
        if(count>0)
            found = true;
    })
    await MLBDaySchedule.countDocuments({_id:gameID},(err,count)=>{
        if(count>0)
            found = true;
    })
    if(found)
        return true;
    return false;
}

exports.fetchGameWithID = fetchGameWithID;

exports.ifIDInSportCollections = ifExist;