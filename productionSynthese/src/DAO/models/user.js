const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type: Number,
        required:true,
        validate(value){
            if(value<18){
                throw new Error("not 18 years old"); //for later: change to render div invalid msg
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(value.length<6){
                throw new Error("password length must be more than 6 characters")
            }
        }
    },
    email:{
        type:String,
        require:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("not an email") //for later: change to render invalid email msg
            }
        }
    },
    balance:{
        type:Number,
        required:true
    }
})

userSchema.pre('save',function(next){
    const user = this;
    const salt = 8;
    if(!user.isModified('password')){
        return next();
    }
    bcrypt.hash(user.password,salt,(error,hashed)=>{
        if(error)
            return next(error);

        user.password = hashed;
        next();
    })
});

const user = mongoose.model('User',userSchema);

module.exports = user;