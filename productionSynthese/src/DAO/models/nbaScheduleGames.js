const mongoose = require("mongoose");

const NBAGameScheduleSchema = new mongoose.Schema({
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

const NBADaySchedule = mongoose.model('nbaschedules',NBAGameScheduleSchema,'nbaschedules');
module.exports = NBADaySchedule;