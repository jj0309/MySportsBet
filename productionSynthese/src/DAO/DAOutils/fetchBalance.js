const user = require('../models/user');

const fetchBalance = async (userToSearch)=>{
    const filter = {username:userToSearch}
    let balance = 0;
    await user.findOne(filter,(err,foundUser)=>{
        if(err) console.log(err);
        if(foundUser) balance = foundUser.balance;
    })
    return balance;
}

exports.fetchBalance = fetchBalance;
 