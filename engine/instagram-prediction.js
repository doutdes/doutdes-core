const Model = require('../models/index');
const FbToken = Model.FbToken;
const InstagramApi = require('../api_handler/instagram-api');



const HttpStatus = require('http-status-codes');
const express = require('express');
const PythonShell =require('python-shell').PythonShell;

const concatenationStrings = async (req,res) => {
    let username = req.body.username;
    let day = req.body.day_publication;
    let month = req.body.month_publication;
    let time = req.body.time_publication;
    let isVideo = req.body.isVideo;
    let caption = req.body.description;

    let followerNum, likeNum, baseline, predictor;
    let season, day_change;
    let mean_5, mean_10, mean_15, mean_20, mean_30, mean_50, mean_1_51;
    let like_prepost, like_pprepost, like_ppprepost, like_pppprepost;
    let happiness, love, sadness, travel, food, pet, angry, music, party, sport;
    let captionInform, hashtags_count, sentiment_score, num_words;

    season = GetSeason(month);
    day_change = ChangeDay(day);
    if(isVideo === true){
        isVideo = 1;
    }else{
        isVideo = 0;
    }

    /*console.log("username: " + username + " day: " + day_change + " month: " + month + " time: " + time + "\n"
    + "season: " + season + " isVideo: " + isVideo);
    console.log("Description: " + caption);*/

    let optionsFollowerNum = {
        args: ['profile', '-u', username]
    };

    likeNum = await ig_getMedia(req.body.page_id, req.user.id)

    followerNum = await ig_getFollower(req.body.page_id, req.user.id)

    // followerNum = await RunFollowerNum(optionsFollowerNum);
    // followerNum = followerNum.substring(2, followerNum.length-1);
    // followerNum = JSON.parse((followerNum))['follower_num'];

    let optionsLikeNum = {
        args: ['posts_full', '-u', username, '-n', '51']
    };

    // likeNum = await RunPostsLikes(optionsLikeNum);
    // likeNum = likeNum.substring(2, likeNum.length-1);
    // likeNum = JSON.parse(likeNum);

    let optionsCaption = {
        args: [caption]
    };

    captionInform = JSON.parse(await RunCaptionScript(optionsCaption));

    hashtags_count = captionInform.hashtags_count;
    sentiment_score = captionInform.sentiment_score;
    num_words = captionInform.n_words;
    happiness = captionInform.happiness;
    love = captionInform.love;
    sadness = captionInform.sadness;
    travel = captionInform.travel;
    food = captionInform.food;
    pet = captionInform.pet;
    angry = captionInform.angry;
    music = captionInform.music;
    party = captionInform.party;
    sport = captionInform.sport;

    mean_5 = Mean_x(likeNum, 5);
    mean_10 = Mean_x(likeNum, 10);
    mean_15 = Mean_x(likeNum, 15);
    mean_20 = Mean_x(likeNum, 20);
    mean_30 = Mean_x(likeNum, 30);
    mean_50 = Mean_x(likeNum, 50);
    mean_1_51 = MeanBaseline(likeNum);

    like_prepost = likeNum[0];
    like_pprepost = likeNum[1];
    like_ppprepost = likeNum[2];
    like_pppprepost = likeNum[3];

    baseline = like_prepost/mean_1_51;
    if(baseline > 0.5){
        baseline = 1;
    }else{
        baseline = 0;
    }

    let optionsPredictor = {
        args: [isVideo, followerNum, time, hashtags_count, sentiment_score, num_words,
        day_change, month, season, mean_5, mean_10, mean_15, mean_20, mean_30, mean_50,
        like_prepost, like_pprepost, like_ppprepost, like_pppprepost, happiness, love,
        sadness, travel, food, pet, angry, music, party, sport, baseline]
    };

    predictor = await RunPredictorScript(optionsPredictor);
    predictor = parseFloat(predictor[0].substring(1,5));

    if(predictor !== undefined){
        return res.status(HttpStatus.OK).send({
            predictor: predictor
        });
    }else{
        return res.status(HttpStatus.BAD_REQUEST).send({
            error: 'Errore'
        });
    }

};

async function ig_getFollower(page_id, user_id) {
    let data, key;

    try {
        key = await FbToken.findOne({where: {user_id: user_id}});
        data = (await InstagramApi.getBusinessDiscoveryInfo(page_id, key.api_key));

        return data['followers_count'];
    } catch (err) {
        console.error(err);
        return []
    }
}


async function ig_getMedia(page_id, user_id) {
    let data, key;
    let n = 51;
    let num_list = [];

    try {
        key = await FbToken.findOne({where: {user_id: user_id}});
        data = (await InstagramApi.getMedia(page_id, key.api_key, n, true))['data'];
        for (let i = 0; i < data.length; i++) {
            num_list[i] = data[i]['like_count']
        }

        return num_list;
    } catch (err) {
        console.error(err);
        return []
    }
}


function RunFollowerNum(optionsFollower){
    return new Promise((resolve,reject) =>{
        PythonShell.run('./CrawlerInstagram/crawler.py', optionsFollower,
            function(err, results){
                if (err) throw err;
                console.log("RECUPERO NUM FOLLOWER ESEGUITO");
                resolve(results[1]);
        });
    })
}
function RunPostsLikes(optionsLikes){
    return new Promise((resolve,reject) =>{
        PythonShell.run('./CrawlerInstagram/crawler.py', optionsLikes,
            function(err, results){
                if (err) throw err;
                resolve(results[2]);
            });
    })
}
function RunCaptionScript(optionsCaption){
    return new Promise((resolve,reject) =>{
        PythonShell.run('./Caption/txt_features.py', optionsCaption,
            function(err, results){
                if (err) throw err;
                console.log("CLASSIFICAZIONE CAPTION ESEGUITO");
                resolve(results);
            });
    })
}
function RunPredictorScript(optionsPredictor){
    return new Promise((resolve,reject) =>{
        PythonShell.run('./Predictor/predictor_v0.1.py', optionsPredictor,
            function(err, results){
                if (err) throw err;
                console.log("PREDITTORE ESEGUITO");
                resolve(results);
            });
    })
}

function MeanBaseline(likesCount){
    let mean = 0;
    for(let i = 1; i < likesCount.length; i++){
        mean += likesCount[i].likes;
    }
    return mean;
}
function GetSeason (month){
    let season;
    switch (month){
        case 2:
        case 3:
        case 4:
            season = 1;
            break;
        case 5:
        case 6:
        case 7:
            season = 2;
            break;
        case 8:
        case 9:
        case 10:
            season = 3;
            break;
        case 11:
        case 0:
        case 1:
            season = 0;
            break;
    }
    return season;
}
function ChangeDay (day){
    switch(day){
        case 0:
            return 6;
            break;
        case 1:
            return 0;
            break;
        case 2:
            return 1;
            break;
        case 3:
            return 2;
            break;
        case 4:
            return 3;
        case 5:
            return 4;
            break;
        case 6:
            return 5;
            break;
    }
}
function Mean_x(likesCount, n){

    let mean = 0;
    for(let i = 0; i < n; i++){
        let likes = likesCount[i];

        mean += likes;
    }

    return mean/n;
}
module.exports = {concatenationStrings};
