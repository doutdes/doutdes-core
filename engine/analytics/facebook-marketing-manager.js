'use strict';

const HttpStatus = require('http-status-codes');
const FbToken = 'EAAjCjZCZAjUisBAJPseHyNT0A1NmX71NUPfhFruP21MSiiA9USAmN7LEiypxCysd2OKRhtgGPTbsRqezLjxOuNc8nTQTBuZBvuEoV9G9E3S3Ywu1w5Jwj1fWTgCPQJ27GvR6J2fgzdSXPOC2IM7bs7nM9ZAOYBTZBZCeGyCRK38wZDZD';
const FacebookMApi = require('../../api_handler/facebook-marketing-api');

// This method will call Facebook Marketing API
const getData = async (req, res) => {
    // GET URL of the call
    console.warn(req.url);

    let response;
    let page_id;

    const type_level = ['insights', 'campaigns', 'adsets', 'ads'];
    let level = '';
    req.url.split("/").forEach(lvl => type_level.includes(lvl) ? level = lvl : level);

    let startDate = '2019-06-28';
    let endDate =  '2019-07-28';

    let group = req.params.group;

    try {
        page_id = req.params.act_id;
        response = await FacebookMApi.facebookQuery(page_id, FbToken,level, startDate, endDate, group);

        return res.status(HttpStatus.OK).send(response);
    }
    catch (err) {
        console.error(err);
        if (err.statusCode === 400) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                name: 'Facebook Bad Request',
                message: 'Invalid OAuth access token.'
            });
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        });
    }
};

// This method will call Facebook Marketing API - getPageAdsIds
const getAdsList = async (req, res) => {
    let data;
    let pages = [];

    try {
        data = (await FacebookMApi.getPageAdsIds(FbToken))['data'];

        for (const index in data) {
            const page = {
                account_id: data[index]['account_id'],
                id: data[index]['id']
            };

            pages.push(page);
        }

        return res.status(HttpStatus.OK).send(pages);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        })
    }
};

module.exports = {getData, getAdsList};
