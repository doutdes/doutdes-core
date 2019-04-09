'use strict';
const Request = require('request-promise');

const Model = require('../../models/index');
const GaToken = Model.GaToken;
const config = require('../../api_handler/youtube-api').config;

const HttpStatus = require('http-status-codes');

/***************** GOOGLE ANALYTICS *****************/
const YoutubeApi = require('../../api_handler/youtube-api');

/*************** KEYS **************/ // TODO delete
const private_key = '-----BEGIN PRIVATE KEY-----\\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDH9h3RpjJGrzrp\\nykMhfXkVEDBBl+cVdQ2smJQg0/WxOmZRUig3UVKZD2JqdB+PnHF7p0iSgH7tK0i4\\nj4EsQgO8Vqw+twkQcZEoX0HnE31LVb30sgCGPLfj504yKwJG82xCEm7pSjR5jGVy\\n4HUbVmoYLsZsidEJT9Z0WoCO/gtS4DRbxdIUNO8c41lNI37d+Q/WPsZC7CWkFMrj\\nmp+BDQftj5p2RMsC0XbdgIS1pPuw6w6XavoSMaOa6d9LHu88vsDyjDf6qkY79ogW\\nCAmpMecTRp85Nm0AiGa6mBaQpbcNcRR9losXcHRrlPpAN5dljRcAEzaqJGshp8L/\\n3GVnxeXpAgMBAAECggEAELGGE0TP8TE7Vp29ZXwbYewIT02Oa+7p/ZT+VtBDNHDG\\n7naQp2+ZWPBdG7yGjv91ROi2CQ8Dqaqhp1DJrKd1NuG4fwLaVZ5ZiziKoK8ymFm3\\n4kgC/bHvey4KC+ulxMUZLlnqGv1ILLaRGJpPBIF+GXc8Nv75bdDVu0B795QTX290\\n9PY6UYAoUaJhNqQwGVjjeXHaivKY1ZZv5mOf4EH0BzcA5Cmx6/vEaSzQf23AOgdg\\nwpuTQXE31HAkDDuRK7DzQQ0aK2WYFQXfgNPHvXzQp3nn4V50nDvIG6PLGwpXazhq\\neLxk+909wInvhfq/oLg5tWgN2XaqmGE4lJwsrOgVgQKBgQDtn447WMGs1/Z1Awk8\\ngfWTTBW8M2jZ0oBONNfVyje+SR5gX+iMKBis5LOf+6bIYbXBXO0kak9eRhdlzT8D\\nhaTNJjJxt7t/hWJJMCFIZTTLLfpt6VHmwmff9nfvjpBNnF2KvKDsFpdyXOSCxBTc\\nZTnTwMr45Byw80ZyOLPaDjoewQKBgQDXbO86Ac/XZhoWG7EEZWVGOWijpYDljOcn\\nZ3ygJZHcjiI3iowzi9YwksyayXIImbRqq/oOjTn6S9QB8vYdjtU4Z3FnoO7q5lqT\\nZDiiZSAK9K1S4f2U2BJDTG354w14n0cLgdKTqASZZfqjQs4eC6rAcIE1OMswncW9\\nkpzo1R45KQKBgQDdk1W2gzn96VeYnt8i+/A5jM4Ls0iHLOGVi3LjmO/H0TixF12q\\nK81uksfoW2mXGn24M+WxeixONT+mHvAuYZVd8stA/NmqvH78zhOLBUxoVZRanyFO\\n82KXFaWazS5EIJWdQ+0umJZZ/sLaKOtm5EE68mCSG2uhmQfMhJE4uOF7QQKBgQCT\\nncXfzdYKF6DQfXEzPffDwxr86DAHHCJZUgSICLaGl67CuGGSAMRozG7/sgI9+nUy\\nk13qEsQjy0ofe8lCP9nDqL6A8DpHJEn0rbxRK1Jlr3wFS25kTBtXmkvR69ATU7Fv\\nJSqSm5NrOgIhVWnAFOaQr4caXSx+x930JT74HPF04QKBgQDVkE+eA4rTyzyOtWZv\\nD19OpIqfjgEs4KhlYMNlUhgHGANwM+urlCq0M8qqMiEW+mr6fCYpvJiA4nHZ0BWK\\n6ThFKomt3+YVaG7TaMP4N00IrMb0xWNv1eLjLblNRdmuDpDBNCsbzHYKNJZwOCw9\\n2GueR9HO5iClzKQgs8izPJovoQ==\\n-----END PRIVATE KEY-----\\n';
const client_email = 'doutdes@doutdes.iam.gserviceaccount.com';
const dataEndPoint = 'https://www.googleapis.com/youtube/v3/channels';
const analyticsEndPoint = 'https://youtubeanalytics.googleapis.com/v2/reports';
const tokenEndPoint = 'https://www.googleapis.com/oauth2/v4/token';


const setMetrics = (metrics, dimensions, sort = null, filters = null) => {
    return function (req, res, next) {
        req.metrics = metrics;
        req.dimensions = dimensions;
        req.sort = sort;
        req.filters = filters;
        next();
    }
};

const getAccessToken = async (req, res) => {
    let result;
    const options = {
        method: 'POST',
        uri: tokenEndPoint,
        qs: {
            client_id: config.ga_client_id,
            client_secret: config.ga_client_secret,
            refresh_token: await GaToken.findOne({where: {user_id: req.user.id}}),
            grant_type: 'refresh_token'
        }
    };

    try {
        result = JSON.parse(await Request(options));
        return result['access_token'];
    } catch (e) {
        console.error(e);
    }
};

const getData = async(id, private_key, start_date, end_date, metrics, dimensions, sort=null, filters=null) => {
    const access_token = await getAccessToken(private_key);

    let params = {
        'access_token': access_token ,
        'ids': id,
        'start-date': start_date,
        'end-date': end_date,
        'metrics': metrics,
        'dimensions': dimensions
    };

    // Optional fields: if they exist, then they can be added to the query params
    if (sort)       params['sort'] = sort;
    if (filters)    params['filters'] = filters;

    const result = await google.analytics('v3').data.ga.get(params);

    return result.data.rows;
};

async function getChannelID(req, res) {
    let result;
    const options = {
        method: GET,
        uri: dataEndPoint,
        qs: {
            access_token: await getAccessToken(req),
            //mine : 'true',
            //part : 'id'
        }
    };
    console.log(token);
    try {
        result = JSON.parse(await Request(options));
        return result['items'][0]['id'];
    } catch (e) {
        console.error(e);
    }
}

module.exports = {setMetrics, getChannelID};
