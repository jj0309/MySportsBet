const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
    docID:{
        type:String,
        required:true,
    },
    gameID:{
        type:Number,
        required:true
    },
    side:{
        type:String,
        required:true
    },
    bettings:{
        type:Object
    }
})

const bet = mongoose.model('Bet',betSchema);

module.exports = bet;