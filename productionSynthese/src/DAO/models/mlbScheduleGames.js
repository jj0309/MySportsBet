const mongoose = require("mongoose");

const MLBGameScheduleSchema = new mongoose.Schema({
    date:{
        type:String,
        unique:true,
        required:true
    },
    games:{
        type:Object,
        required:true
    },
    references:{
        type:Object,
        required:true
    }
})

const MLBDaySchedule = mongoose.model('mlbschedules',MLBGameScheduleSchema,'mlbschedules');
module.exports = MLBDaySchedule;