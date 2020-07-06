/* 
    KNOWN ISSUE: PARSING AN OBJECTID OF MORE THAN 12BYTES WHILE TRYING TO FIND BY IT'S ID IN THE 
    MONGODB WILL CAUSE A CRASH SOLUTION TO IMPLEMENT LATER -> CATCH AND RETURN AN INVALID RESPONSE
    TO USER
*/

const express = require('express');
const router = express.Router();
const authenticateUtil = require('../utils/authenticateToken');
const fetchGame = require('../DAO/DAOutils/mise/fetchGame');
const miseUtil = require('../utils/mise/miseTeam');
const bet = require('../DAO/models/bet');
const user = require('../DAO/models/user');
const createLocalObj = require('../utils/navbarData');

router.get('/',authenticateUtil.authenticateToken,(req,res)=>{
    res.redirect("/schedule");
});

//specific routes
router.get('/:sport/:objectID/:gameIndex',authenticateUtil.authenticateToken,async(req,res)=>{
    let objectID = req.params.objectID;
    let gameIndex = req.params.gameIndex;
    let sportParam = req.params.sport;
    if( sportParam != "hockey" && sportParam != "basket" && sportParam != "baseball")
        return res.redirect(req.params+"/SportNotFound");
    gameIndex = parseInt(gameIndex);
    //find the game using the id in the database
    if(!fetchGame.ifIDInSportCollections(objectID))
        return res.redirect("/invalidLink");
    let foundGame = await fetchGame.fetchGameWithID(objectID);
    if(miseUtil.ifArrIsNull(foundGame)||miseUtil.badIndex(gameIndex,foundGame))
        return res.redirect(req.params+"/GameNotFound");
    //process the data returned from the db
    data={
        userData:"",
        game:"",
        teamImg:"",
        stats:"",
        dbObjID:objectID,
        dbGameIndex:gameIndex,
        sport:sportParam,
        bettingObj:"",
        bettingOddsHome:"",
        bettingOddsAway:""
    };
    gameObj = miseUtil.fetchTeams(foundGame,gameIndex);
    data["game"] = gameObj;
    // on fetch les team logos
    data["teamImg"] = miseUtil.fetchIMG(gameObj,foundGame);
    data["stats"] = miseUtil.fetchStats(gameObj);
    data.userData = await createLocalObj.createLocalObj(data,req.user);
    // fetch and process les bets de cette game deja mise
    let awayBetsOBJ = null;
    let homeBetsOBJ = null;
    await bet.findOne({docID:objectID,gameID:gameIndex,side:"away"},(err,awayBets)=>{
        if(err) console.log(err);
        if(awayBets != null)
            awayBetsOBJ = awayBets.bettings;
    });
    await bet.findOne({docID:objectID,gameID:gameIndex,side:"home"},(err,homeBets)=>{
        if(err) console.log(err);
        if(homeBets != null)
            homeBetsOBJ = homeBets.bettings;
    });
    let oddObj = miseUtil.createOdds(awayBetsOBJ,homeBetsOBJ);
    data["bettingOddsHome"] = oddObj["homeOdd"];
    data["bettingOddsAway"] = oddObj["awayOdd"];
    data["bettingObj"] = miseUtil.createBettingDatas(awayBetsOBJ,homeBetsOBJ);
    res.render("../public/Mise.ejs",data);
})

router.post('/:sport/:objectID/:gameIndex/:team',authenticateUtil.authenticateToken,async(req,res)=>{
    let objectID = req.params.objectID;
    let gameIndex = req.params.gameIndex;
    gameIndex = parseInt(gameIndex);
    let sportParam = req.params.sport;
    let awayOrHome = req.params.team;
    //verifications to see if he has access to the betting
    //verification on if the user has manipulated the post action
    if(awayOrHome != "home" && awayOrHome != "away")
        return res.redirect("/TemperedLink/temperedSide");
    if(!fetchGame.ifIDInSportCollections(objectID))
        return res.redirect("invalidLink");
    if( sportParam != "hockey" && sportParam != "basket" && sportParam != "baseball")
        return res.redirect(req.params+"/SportNotFound");

    let foundGame = await fetchGame.fetchGameWithID(objectID);

    if(miseUtil.ifArrIsNull(foundGame)||miseUtil.badIndex(gameIndex,foundGame))
        return res.redirect(req.params+"/GameNotFound");

    data={
        userData:"",
        game:"",
        teamImg:"",
        stats:"",
        dbObjID:objectID,
        dbGameIndex:gameIndex,
        sport:sportParam,
        transactionSuccess:false
    };
    //fetch the data to render the stats
    gameObj = miseUtil.fetchTeams(foundGame,gameIndex);
    data["game"] = gameObj;
    data["teamImg"] = miseUtil.fetchIMG(gameObj,foundGame);
    data["stats"] = miseUtil.fetchStats(gameObj);
    //end of data fetching for page render

    //verify if the user is logged in
    // KNOWN ISSUE: HAVING TO USE DATA["USERDATA"]["USERDATA"] INSTEAD OF DATA["USERDATA"]
    data.userData = await createLocalObj.createLocalObj(data,req.user);
    if(data["userData"]["userData"]==''){
        return res.redirect("/login");
    }
    //verify amount
    let amount = 0;
    if(/^\d+$/.test(req.body["amount"]))
        amount = parseInt(req.body["amount"]);
    // verifications over

    //updating into the database
    bet.findOne({docID:objectID,gameID:gameIndex,side:awayOrHome},async(err,game)=>{
        if(err){
            console.log(err);
            res.redirect("/transactionError");
        };
        let usernameFilter = data["userData"]["userData"]["username"];
        let userBalance = 0
        let validated = false
        await user.findOne({username:usernameFilter},(err,found)=>{
            if (err)
                return res.redirect('/userNotFound');
            userBalance = found.balance;
            if(userBalance - amount < 0)
                return res.redirect('insuffisantFund');
            else{
                userBalance = userBalance - amount;
                validated = true;
            }
        })
        // if it's the first bet
        if(game == null){
            newBet={
                docID:objectID,
                gameID:gameIndex,
                side:awayOrHome,
                bettings:{}
            }
            newBet["bettings"][usernameFilter] = amount;
            mise = new bet(newBet);
            try{
                await mise.save(async(error)=>{
                    if(error){
                        console.log(error);
                        res.redirect("/transactionError");
                    };
                    await user.findOneAndUpdate({username:usernameFilter},{balance:userBalance},(err)=>{
                        if(err == undefined)
                            data["transactionSuccess"] = true;
                    });
                })
            }catch(e){
                return res.status(400).send(e);
            };
        }else{
            // if the betting document already exists

            //get the betting document
            bettingDocument = game.bettings;
            await user.findOneAndUpdate({username:usernameFilter},{balance:userBalance},(err)=>{
                if(err == undefined)
                    data["transactionSuccess"] = true;
            });
            //get the user last betting if it's in there
            if(bettingDocument[usernameFilter] != undefined)
                amount = bettingDocument[usernameFilter] + amount;
            //update the betting document
            bettingDocument[usernameFilter] = amount;
            //update it in the db
            await bet.findOneAndUpdate({docID:objectID,gameID:gameIndex,side:awayOrHome},{bettings:bettingDocument},(err)=>{
                if(err) console.log(err);
            });
        }
    })
    res.redirect('/mise/'+sportParam+"/"+objectID+"/"+gameIndex);
})

module.exports = router;