const mongoose = require("mongoose");

const NHLGameSchedule = new mongoose.Schema({
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

const NHLDaySchedule = mongoose.model('nhlschedules',NHLGameSchedule,'nhlschedules');
module.exports = NHLDaySchedule;
