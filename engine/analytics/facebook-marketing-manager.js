'use strict';

const HttpStatus = require('http-status-codes');

const getData = async (req, res) => {

    // GET URL of the call
    console.warn(req.url);

    // This method will call Facebook Marketing API
    return res.status(HttpStatus.OK).send({
        proof: true,
        // req: req,
        messsage: 'It works'
    })
};

const getAdsList = async (req, res) => {

    // This method will call Facebook Marketing API - getPageAdsIds
    return res.status(HttpStatus.OK).send({
        proof: true,
        messsage: 'It works'
    })
};

module.exports = {getData, getAdsList};